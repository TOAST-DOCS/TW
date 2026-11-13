const { discoverRepos, getBranch, hasTargetDir, getChangedFiles } = require('./github');
const { fetchGuideTasks, fetchDeployNotes, sendWebhook } = require('./dooray');
const { loadState, saveState, loadJSON, saveJSON } = require('./state');
const { generateSite } = require('./generate-site');
const { loadGuides, analyzeChange, extractKeywordsFromText, findKeywordMatches } = require('./analyze');
const config = require('./config');
const path = require('path');
const fs = require('fs');

/**
 * Load guide-mapping.json
 */
function loadGuideMapping() {
  const p = path.resolve(__dirname, '..', config.GUIDE_MAPPING_FILE);
  if (!fs.existsSync(p)) return { mappings: [] };
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

/**
 * Find affected guides for a given repo name
 */
function findAffectedGuides(repoName, mappings) {
  return mappings
    .filter((m) => m.repos.includes(repoName))
    .map((m) => ({ guide: m.guide, title: m.title, assignee: m.assignee }));
}

/**
 * GHE 변경 감지 (트랙 A)
 */
async function pollGHE(guideMapping, guides) {
  console.log(`[GHE] Polling ${config.GHE_ORG} on ${config.GHE_API}`);
  const state = loadState();
  const changes = [];
  const discoveredRepos = [];

  const allRepos = await discoverRepos();
  console.log(`  Found ${allRepos.length} repos in ${config.GHE_ORG}`);

  for (const repo of allRepos) {
    const repoName = repo.name;
    const branch = await getBranch(repoName);
    if (!branch) continue;

    const hasKo = await hasTargetDir(repoName);
    if (!hasKo) continue;

    discoveredRepos.push(repoName);
    const currentSha = branch.commit.sha;
    const repoState = state.repos[repoName];

    if (!repoState) {
      console.log(`  [NEW] ${repoName} - tracking from ${currentSha.substring(0, 7)}`);
      state.repos[repoName] = {
        lastSha: currentSha,
        lastChecked: new Date().toISOString(),
        firstSeen: new Date().toISOString(),
      };
      continue;
    }

    if (repoState.lastSha === currentSha) continue;

    console.log(`  [CHANGED] ${repoName}: ${repoState.lastSha.substring(0, 7)} -> ${currentSha.substring(0, 7)}`);
    try {
      const diff = await getChangedFiles(repoName, repoState.lastSha, currentSha);
      if (diff.mdChanges > 0) {
        // 키워드 매칭 분석
        const analysisResults = analyzeChange(
          { repo: repoName, files: diff.files, mdChanges: diff.mdChanges },
          guides,
          guideMapping.mappings
        );
        // 분석 결과가 있으면 그걸 사용, 없으면 리포 매핑 폴백
        const affected = analysisResults.length > 0
          ? analysisResults
          : findAffectedGuides(repoName, guideMapping.mappings);

        changes.push({
          id: `ghe-${repoName}-${Date.now()}`,
          source: 'ghe',
          repo: repoName,
          previousSha: repoState.lastSha,
          currentSha,
          compareUrl: diff.compareUrl,
          mdChanges: diff.mdChanges,
          files: diff.files.map((f) => ({ filename: f.filename, status: f.status, additions: f.additions, deletions: f.deletions })),
          affectedGuides: affected,
          analysisMethod: analysisResults.length > 0 ? 'keyword' : 'repo-mapping',
          detectedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`  [ERROR] ${repoName}: ${err.message}`);
    }

    state.repos[repoName] = {
      ...repoState,
      lastSha: currentSha,
      lastChecked: new Date().toISOString(),
    };
  }

  saveState(state);
  return { changes, discoveredRepos };
}

/**
 * 두레이 태스크 조회 (섹션 1)
 */
async function pollDoorayTasks() {
  console.log(`[Dooray] Fetching guide tasks from project ${config.DOORAY_PROJECT_ID}`);
  const tasks = await fetchGuideTasks();
  console.log(`  Found ${tasks.length} How-to/Troubleshooting tasks`);

  const result = {
    fetchedAt: new Date().toISOString(),
    tasks,
  };

  saveJSON(config.DOORAY_TASKS_FILE, result);
  return result;
}

/**
 * 월별 배포 사항 조회 (트랙 B)
 */
async function pollDeployNotes(guideMapping) {
  console.log(`[Dooray] Fetching deploy notes`);
  const months = await fetchDeployNotes();
  console.log(`  Found ${months.length} monthly deploy notes`);

  // 각 서비스에 영향받는 가이드 매핑 (서비스명 + 키워드 분석)
  const guides = loadGuides();
  for (const month of months) {
    for (const svc of month.services) {
      // 1단계: 서비스명으로 후보 가이드 선정
      const candidates = guideMapping.mappings.filter((m) =>
        m.service.toLowerCase().includes(svc.service.toLowerCase()) ||
        svc.service.toLowerCase().includes(m.service.toLowerCase())
      );

      // 2단계: 배포 사항 텍스트에서 키워드 추출 → 가이드 본문과 매칭
      const keywords = extractKeywordsFromText(svc.changes);
      if (keywords.length === 0 || guides.length === 0) {
        // 키워드가 없으면 서비스명 매칭만으로 포함
        svc.affectedGuides = candidates.map((m) => ({
          guide: m.guide,
          title: m.title,
          assignee: m.assignee,
        }));
      } else {
        const filtered = [];
        for (const m of candidates) {
          const guide = guides.find((g) => g.filename === m.guide);
          if (!guide) continue;
          const matches = findKeywordMatches(keywords, guide.content);
          if (matches.length >= 2) {
            filtered.push({
              guide: m.guide,
              title: m.title,
              assignee: m.assignee,
              matchedKeywords: matches.slice(0, 5).map((mt) => mt.keyword),
            });
          }
        }
        svc.affectedGuides = filtered;
      }
    }
  }

  const result = {
    fetchedAt: new Date().toISOString(),
    months,
  };

  saveJSON(config.DEPLOY_NOTES_FILE, result);
  return result;
}

/**
 * 현행화 알림 발송
 */
async function notifyUpdates(gheChanges, deployNotes, resolved) {
  const resolvedKeys = new Set(
    (resolved.resolved || []).map((r) => r.updateId + '::' + (r.guide || ''))
  );

  // GHE 변경 알림
  for (const change of gheChanges) {
    if (change.affectedGuides.length === 0) continue;
    // 미처리 가이드만 필터
    const pendingGuides = change.affectedGuides.filter(
      (g) => !resolvedKeys.has(change.id + '::' + g.guide)
    );
    if (pendingGuides.length === 0) continue;

    const guideLines = pendingGuides.map((g) => {
      if (g.matches && g.matches.length > 0) {
        const kwList = g.matches.map((m) => m.keyword).join(', ');
        return `• ${g.title} (담당: ${g.assignee})\n  → 변경 diff에서 [${kwList}] 키워드가 확인되었으며, 해당 가이드에서도 동일 키워드를 포함하고 있어 변경 필요 여부를 확인해 주세요.`;
      }
      return `• ${g.title} (담당: ${g.assignee})\n  → 동일 서비스의 문서가 변경되었습니다. 가이드 내용에 영향이 있는지 확인해 주세요.`;
    });
    const message = [
      '📋 [실전 가이드 현행화 확인 요청]',
      '',
      `${change.repo} 리포지터리에서 ko/ 디렉터리 내 ${change.mdChanges}개 파일이 변경되었습니다.`,
      '',
      '확인이 필요한 가이드:',
      ...guideLines,
      '',
      `👉 대시보드에서 상세 확인: ${config.DASHBOARD_URL}`,
    ].join('\n');

    await sendWebhook(message);
  }

  // 배포 사항 알림 (최신 월만)
  if (deployNotes.months && deployNotes.months.length > 0) {
    const latest = deployNotes.months[0];
    const affectedServices = latest.services.filter(
      (s) => s.affectedGuides && s.affectedGuides.length > 0
    );

    if (affectedServices.length > 0) {
      const lines = affectedServices.map((s) => {
        const guides = s.affectedGuides.map((g) => `  • ${g.title}`).join('\n');
        return `[${s.service}] ${s.changes.substring(0, 80)}\n${guides}`;
      });

      const message = [
        `📢 [${latest.month} 배포 사항 현행화 알림]`,
        '',
        ...lines,
        '',
        `👉 대시보드에서 확인: ${config.DASHBOARD_URL}`,
      ].join('\n');

      await sendWebhook(message);
    }
  }
}

/**
 * 7일 경과 미처리 건 리마인드 (1회만)
 */
async function sendReminders(gheUpdates, resolved) {
  const resolvedKeys = new Set(
    (resolved.resolved || []).map((r) => r.updateId + '::' + (r.guide || ''))
  );
  const reminded = new Set(
    (gheUpdates._reminded || [])
  );

  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const newReminded = [];

  const allChanges = (gheUpdates.history || []).flatMap((h) => h.changes || []);

  for (const change of allChanges) {
    if (!change.affectedGuides || change.affectedGuides.length === 0) continue;
    if (reminded.has(change.id)) continue; // 이미 리마인드 발송함

    const detected = new Date(change.detectedAt).getTime();
    if (now - detected < SEVEN_DAYS) continue; // 7일 미경과

    // 미처리 가이드만 필터
    const pending = change.affectedGuides.filter(
      (g) => !resolvedKeys.has(change.id + '::' + g.guide)
    );
    if (pending.length === 0) continue; // 전부 처리됨

    const guideLines = pending.map((g) =>
      `• ${g.title} (담당: ${g.assignee})`
    );
    const message = [
      '🔔 [현행화 리마인드]',
      '',
      `${change.repo} 리포지터리 변경 감지 후 7일이 경과했으나 아직 확인되지 않은 가이드가 있습니다.`,
      '',
      ...guideLines,
      '',
      `👉 대시보드에서 확인: ${config.DASHBOARD_URL}`,
    ].join('\n');

    await sendWebhook(message);
    newReminded.push(change.id);
    console.log(`  [REMIND] ${change.repo}: ${pending.length}건 미처리`);
  }

  // 리마인드 이력 저장 (중복 발송 방지)
  if (newReminded.length > 0) {
    gheUpdates._reminded = [...(gheUpdates._reminded || []), ...newReminded];
  }

  return newReminded.length;
}

/**
 * PR 상태 추적 — resolved.json에서 pr-linked 건의 머지 여부 확인
 * GitHub.com API 사용 (GHE가 아닌 TOAST-DOCS/TW 리포)
 */
async function checkPrStatuses(resolved) {
  const prItems = (resolved.resolved || []).filter(
    (r) => r.resolution === 'pr-linked' && r.prNumber && r.prStatus !== 'merged' && r.prStatus !== 'closed'
  );
  if (prItems.length === 0) return 0;

  const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
  const ghHeaders = { Accept: 'application/vnd.github+json', 'User-Agent': 'practical-guides-dashboard' };
  if (ghToken) ghHeaders.Authorization = `Bearer ${ghToken}`;

  let updated = 0;
  for (const item of prItems) {
    try {
      const url = `https://api.github.com/repos/TOAST-DOCS/TW/pulls/${item.prNumber}`;
      const res = await fetch(url, { headers: ghHeaders });
      if (!res.ok) continue;
      const pr = await res.json();

      const newStatus = pr.merged_at ? 'merged' : pr.state; // 'open', 'closed', 'merged'
      if (newStatus !== (item.prStatus || 'open')) {
        item.prStatus = newStatus;
        if (pr.merged_at) item.mergedAt = pr.merged_at;
        updated++;
        console.log(`  [PR] #${item.prNumber} ${item.guide}: ${newStatus}`);

        // 머지 완료 알림
        if (newStatus === 'merged') {
          await sendWebhook([
            '✅ [현행화 반영 완료]',
            '',
            `PR #${item.prNumber}이 머지되었습니다.`,
            `• ${item.guide}`,
            '',
            `👉 대시보드에서 확인: ${config.DASHBOARD_URL}`,
          ].join('\n'));
        }
      }
    } catch (err) {
      console.error(`  [WARN] PR #${item.prNumber} check failed: ${err.message}`);
    }
  }

  if (updated > 0) {
    saveJSON(config.RESOLVED_FILE, resolved);
  }
  return updated;
}

/**
 * 메인 실행
 */
async function runPoll() {
  console.log(`[${new Date().toISOString()}] Poll started`);

  const guideMapping = loadGuideMapping();
  const guides = loadGuides();
  const resolved = loadJSON(config.RESOLVED_FILE, { resolved: [] });
  console.log(`[Analyze] Loaded ${guides.length} guide files for keyword matching`);

  // 1. 두레이 태스크 조회
  const doorayResult = await pollDoorayTasks();

  // 2. GHE 변경 감지 + 키워드 분석
  const gheResult = await pollGHE(guideMapping, guides);

  // 3. GHE 결과 저장
  const existing = loadJSON(config.RESULTS_FILE, { lastPoll: null, heartbeat: null, changes: [], history: [] });
  existing.lastPoll = new Date().toISOString();
  existing.heartbeat = {
    timestamp: new Date().toISOString(),
    trackedRepos: gheResult.discoveredRepos.length,
    repoNames: gheResult.discoveredRepos,
  };
  if (gheResult.changes.length > 0) {
    existing.history = [
      { pollDate: new Date().toISOString(), changes: gheResult.changes },
      ...(existing.history || []),
    ];
  }
  existing.changes = gheResult.changes;
  saveJSON(config.RESULTS_FILE, existing);

  // 4. 월별 배포 사항 조회
  let deployResult = { fetchedAt: null, months: [] };
  try {
    deployResult = await pollDeployNotes(guideMapping);
  } catch (err) {
    console.error(`  [WARN] Deploy notes fetch failed: ${err.message}`);
  }

  // 5. 현행화 알림 발송
  await notifyUpdates(gheResult.changes, deployResult, resolved);

  // 6. 7일 경과 미처리 건 리마인드
  const remindCount = await sendReminders(existing, resolved);
  if (remindCount > 0) {
    saveJSON(config.RESULTS_FILE, existing); // 리마인드 이력 저장
    console.log(`  Sent ${remindCount} reminder(s)`);
  }

  // 7. PR 상태 추적
  const prUpdated = await checkPrStatuses(resolved);
  if (prUpdated > 0) {
    console.log(`  Updated ${prUpdated} PR status(es)`);
  }

  // 8. 사이트 생성
  const sitePath = generateSite();
  console.log(`  Site generated: ${sitePath}`);

  console.log(`[${new Date().toISOString()}] Poll complete. ${gheResult.changes.length} GHE changes, ${doorayResult.tasks.length} tasks.`);
}

if (require.main === module) {
  runPoll().catch(console.error);
}

module.exports = { runPoll };
