const { discoverRepos, getBranch, hasTargetDir, getChangedFiles } = require('./github');
const { fetchGuideTasks, fetchDeployNotes, sendWebhook } = require('./dooray');
const { loadState, saveState, loadJSON, saveJSON } = require('./state');
const { generateSite } = require('./generate-site');
const { loadGuides, analyzeChange } = require('./analyze');
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
 * GHE 변경의 서비스와 매칭되는 배포 사항 텍스트 조회
 */
function findDeployContext(repoName, guideMapping, deployNotes, affectedGuides) {
  // 리포 → 서비스명 역매핑
  const services = guideMapping.mappings
    .filter((m) => m.repos.includes(repoName))
    .map((m) => m.service.toLowerCase());
  if (services.length === 0 || !deployNotes.months) return [];

  // 영향받는 가이드 중 가장 최근 publishedAt을 기준으로 이후 월만 포함
  let cutoffMonth = null;
  if (affectedGuides && affectedGuides.length > 0) {
    const publishDates = affectedGuides
      .map((g) => {
        const mapping = guideMapping.mappings.find((m) => m.guide === g.guide);
        return mapping && mapping.publishedAt ? mapping.publishedAt.substring(0, 7) : null;
      })
      .filter(Boolean);
    if (publishDates.length > 0) {
      cutoffMonth = publishDates.sort().pop(); // 가장 최근 배포 월
    }
  }

  const contexts = [];
  for (const month of deployNotes.months) {
    // cutoffMonth 이전 월은 건너뜀 (가이드 배포 시점에 이미 반영된 내용)
    if (cutoffMonth && month.month <= cutoffMonth) continue;
    for (const svc of month.services) {
      if (services.some((s) => s.includes(svc.service.toLowerCase()) || svc.service.toLowerCase().includes(s))) {
        contexts.push({ month: month.month, service: svc.service, changes: svc.changes });
      }
    }
  }
  return contexts;
}

/**
 * GHE 변경 감지 (유일한 트리거)
 */
async function pollGHE(guideMapping, guides, deployNotes) {
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

        const deployContext = findDeployContext(repoName, guideMapping, deployNotes, affected);
        changes.push({
          id: `ghe-${repoName}-${Date.now()}`,
          source: 'ghe',
          repo: repoName,
          previousSha: repoState.lastSha,
          currentSha,
          compareUrl: diff.compareUrl,
          mdChanges: diff.mdChanges,
          files: diff.files.map((f) => ({ filename: f.filename, status: f.status, additions: f.additions, deletions: f.deletions, patch: f.patch || '' })),
          affectedGuides: affected,
          analysisMethod: analysisResults.length > 0 ? 'keyword' : 'repo-mapping',
          deployContext,
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
 * 월별 배포 사항 조회 (컨텍스트 데이터 — 단독 트리거 아님)
 */
async function pollDeployNotes() {
  console.log(`[Dooray] Fetching deploy notes`);
  const months = await fetchDeployNotes();
  console.log(`  Found ${months.length} monthly deploy notes`);

  const result = {
    fetchedAt: new Date().toISOString(),
    months,
  };

  saveJSON(config.DEPLOY_NOTES_FILE, result);
  return result;
}

/**
 * 변경 관리 알림 발송 — 전체 변경을 단일 요약 메시지로 발송
 */
async function notifyUpdates(gheChanges, deployNotes, resolved) {
  const resolvedKeys = new Set(
    (resolved.resolved || []).map((r) => r.updateId + '::' + (r.guide || ''))
  );

  // 미처리 건이 있는 리포만 수집
  const pendingRepos = [];
  let totalGuides = 0;
  for (const change of gheChanges) {
    if (change.affectedGuides.length === 0) continue;
    const pendingGuides = change.affectedGuides.filter(
      (g) => !resolvedKeys.has(change.id + '::' + g.guide)
    );
    if (pendingGuides.length === 0) continue;
    pendingRepos.push({ change, pendingGuides });
    totalGuides += pendingGuides.length;
  }

  if (pendingRepos.length === 0) return;

  // 리포별 블록 조립
  const MAX_MSG_LEN = 3800;
  const repoBlocks = [];
  for (const { change, pendingGuides } of pendingRepos) {
    const lines = [`■ ${change.repo} (변경 파일 ${change.mdChanges}개)`];

    const ctxLines = (change.deployContext || []).map(
      (ctx) => `  📌 [${ctx.month} 배포 사항] ${ctx.changes.substring(0, 100)}`
    );
    if (ctxLines.length > 0) lines.push(...ctxLines);

    for (const g of pendingGuides) {
      if (g.matches && g.matches.length > 0) {
        const kwList = g.matches.map((m) => m.keyword).join(', ');
        lines.push(`  • ${g.title} (담당: ${g.assignee})`);
        lines.push(`    → [${kwList}] 키워드 일치, 변경 필요 여부 확인 필요`);
      } else {
        lines.push(`  • ${g.title} (담당: ${g.assignee})`);
        lines.push(`    → 동일 서비스 문서 변경, 가이드 영향 확인 필요`);
      }
    }
    repoBlocks.push(lines.join('\n'));
  }

  // 메시지 조립 (길이 초과 시 말줄임)
  const header = [
    '📋 [실전 가이드 변경 관리 확인 요청]',
    '',
    `${pendingRepos.length}개 리포지터리에서 변경이 감지되어 ${totalGuides}건의 가이드 확인이 필요합니다.`,
    '',
  ].join('\n');
  const footer = `\n\n👉 대시보드에서 상세 확인: ${config.DASHBOARD_URL}`;

  let body = '';
  for (let i = 0; i < repoBlocks.length; i++) {
    const candidate = body + (body ? '\n\n' : '') + repoBlocks[i];
    if ((header + candidate + footer).length > MAX_MSG_LEN) {
      const remaining = repoBlocks.length - i;
      body += `\n\n... 외 ${remaining}개 리포지터리 (대시보드에서 확인)`;
      break;
    }
    body = candidate;
  }

  await sendWebhook(header + body + footer);
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
  const pendingRepos = [];

  const allChanges = (gheUpdates.history || []).flatMap((h) => h.changes || []);

  for (const change of allChanges) {
    if (!change.affectedGuides || change.affectedGuides.length === 0) continue;
    if (reminded.has(change.id)) continue;

    const detected = new Date(change.detectedAt).getTime();
    if (now - detected < SEVEN_DAYS) continue;

    const pending = change.affectedGuides.filter(
      (g) => !resolvedKeys.has(change.id + '::' + g.guide)
    );
    if (pending.length === 0) continue;

    pendingRepos.push({ change, pending });
    newReminded.push(change.id);
    console.log(`  [REMIND] ${change.repo}: ${pending.length}건 미처리`);
  }

  // 단일 요약 메시지 발송
  if (pendingRepos.length > 0) {
    const totalGuides = pendingRepos.reduce((sum, r) => sum + r.pending.length, 0);
    const repoBlocks = pendingRepos.map(({ change, pending }) => {
      const guideLines = pending.map((g) => `  • ${g.title} (담당: ${g.assignee})`);
      return `■ ${change.repo} (감지 후 7일 경과)\n${guideLines.join('\n')}`;
    });

    const message = [
      '🔔 [변경 관리 리마인드]',
      '',
      `${pendingRepos.length}개 리포지터리에서 변경 감지 후 7일이 경과했으나 확인되지 않은 가이드가 ${totalGuides}건 있습니다.`,
      '',
      repoBlocks.join('\n\n'),
      '',
      `👉 대시보드에서 확인: ${config.DASHBOARD_URL}`,
    ].join('\n');

    await sendWebhook(message);
  }

  if (newReminded.length > 0) {
    gheUpdates._reminded = [...(gheUpdates._reminded || []), ...newReminded];
  }

  return newReminded.length;
}

/**
 * guide-mapping 자동 보강: 두레이 태스크 + task-guide/ko/ 파일 기반
 * - 미매핑 파일의 H1 제목과 두레이 태스크 제목을 매칭
 * - 서비스→repos는 기존 매핑 룩업 + GHE 리포 퍼지 매칭
 */
function syncGuideMapping(guideMapping, doorayTasks, discoveredRepos) {
  const mappings = guideMapping.mappings;
  const existingGuides = new Set(mappings.map((m) => m.guide));
  const existingTitles = new Set(mappings.map((m) => m.title.toLowerCase()));

  // 서비스→repos 룩업 테이블 (기존 매핑에서 구축)
  const serviceRepoMap = {};
  for (const m of mappings) {
    const svc = m.service.toLowerCase();
    if (!serviceRepoMap[svc]) serviceRepoMap[svc] = new Set();
    m.repos.forEach((r) => serviceRepoMap[svc].add(r));
  }

  // task-guide/ko/ 실제 파일 스캔 → 미매핑 파일의 H1 제목 읽기
  const guideDir = path.resolve(__dirname, '..', 'task-guide', 'ko');
  if (!fs.existsSync(guideDir)) return 0;

  const guideFiles = fs.readdirSync(guideDir).filter((f) => f.endsWith('.md'));
  const unmappedFiles = {};
  for (const f of guideFiles) {
    if (existingGuides.has(`task-guide/ko/${f}`)) continue;
    try {
      const content = fs.readFileSync(path.join(guideDir, f), 'utf-8');
      const h1Match = content.match(/^#\s+(.+)/m);
      if (h1Match) unmappedFiles[f] = h1Match[1].trim();
    } catch (e) { /* skip unreadable files */ }
  }

  if (Object.keys(unmappedFiles).length === 0) return 0;

  // 두레이 태스크 ↔ 미매핑 파일 매칭 후 자동 추가
  let added = 0;
  for (const task of doorayTasks) {
    const cleanTitle = task.title.replace(/^\[(How-to|Troubleshooting)\]\s*/, '').trim();
    if (existingTitles.has(cleanTitle.toLowerCase())) continue;

    // 파일 H1과 매칭 (단어 70% 이상 겹치면 동일 문서로 판정)
    let matchedFile = null;
    for (const [file, h1] of Object.entries(unmappedFiles)) {
      if (titlesMatch(h1, cleanTitle)) {
        matchedFile = file;
        break;
      }
    }
    if (!matchedFile) continue;

    // 서비스명 추출 (기존 매핑 우선 → 제목에서 영문 서비스명 추출)
    const service = extractServiceFromTitle(cleanTitle, mappings);

    // repos 결정: 기존 서비스 룩업 → GHE 리포 퍼지 매칭
    const svcKey = service.toLowerCase();
    let repos = [];
    if (serviceRepoMap[svcKey]) {
      repos = [...serviceRepoMap[svcKey]];
    } else if (discoveredRepos && discoveredRepos.length > 0) {
      repos = fuzzyMatchRepos(service, discoveredRepos);
    }

    // publishedAt: git 최초 커밋일 조회, 실패 시 _autoAdded 날짜 사용
    let publishedAt = new Date().toISOString().slice(0, 10);
    try {
      const { execSync } = require('child_process');
      const log = execSync(`git log --diff-filter=A --format="%ai" -- task-guide/ko/${matchedFile}`, { encoding: 'utf-8' }).trim();
      const lines = log.split('\n').filter(Boolean);
      if (lines.length > 0) publishedAt = lines[lines.length - 1].substring(0, 10);
    } catch (e) { /* git 조회 실패 시 오늘 날짜 사용 */ }

    mappings.push({
      guide: `task-guide/ko/${matchedFile}`,
      title: unmappedFiles[matchedFile],
      service,
      repos,
      assignee: task.assignees[0] || '미지정',
      publishedAt,
      _autoAdded: new Date().toISOString().slice(0, 10),
    });

    existingTitles.add(cleanTitle.toLowerCase());
    delete unmappedFiles[matchedFile];
    added++;
    console.log(`  [MAPPING] Auto-added: ${matchedFile} → ${service} [${repos.join(', ')}]`);
  }

  if (added > 0) {
    guideMapping._updated = new Date().toISOString().slice(0, 10);
    const p = path.resolve(__dirname, '..', config.GUIDE_MAPPING_FILE);
    fs.writeFileSync(p, JSON.stringify(guideMapping, null, 2), 'utf-8');
    console.log(`  [MAPPING] ${added} new mapping(s) added`);
  }

  return added;
}

/**
 * 제목 유사도 비교 — 단어 70% 이상 겹치면 동일 문서로 판정
 */
function titlesMatch(a, b) {
  const na = a.toLowerCase();
  const nb = b.toLowerCase();
  if (na === nb) return true;

  const wordsA = na.split(/[\s,]+/).filter((w) => w.length > 1);
  const wordsB = nb.split(/[\s,]+/).filter((w) => w.length > 1);
  const setB = new Set(wordsB);
  const overlap = wordsA.filter((w) => setB.has(w)).length;
  return overlap / Math.max(wordsA.length, wordsB.length) >= 0.7;
}

/**
 * 제목에서 서비스명 추출
 * 1) 기존 매핑에 있는 서비스명이 제목에 포함되면 재사용
 * 2) 한국어 조사 앞 영문 서비스명 추출
 * 3) 첫 영문 단어 그룹 폴백
 */
function extractServiceFromTitle(title, existingMappings) {
  const knownServices = [...new Set(existingMappings.map((m) => m.service))];
  knownServices.sort((a, b) => b.length - a.length); // 긴 이름 우선 매칭

  for (const svc of knownServices) {
    if (title.toLowerCase().includes(svc.toLowerCase())) return svc;
  }

  const particleMatch = title.match(/^([A-Za-z][A-Za-z0-9 .-]+?)(?:으로|에서|로|에|의|를|가|은|는|와|과|이|을)/);
  if (particleMatch) return particleMatch[1].trim();

  const engMatch = title.match(/([A-Za-z][A-Za-z0-9 .-]+)/);
  if (engMatch) return engMatch[1].trim();

  return '미분류';
}

/**
 * GHE 리포 이름과 서비스명 퍼지 매칭
 */
function fuzzyMatchRepos(service, discoveredRepos) {
  const normalized = service.toLowerCase().replace(/\s+/g, '-');
  const variations = [normalized, normalized.replace(/-/g, ''), ...normalized.split('-')];

  return discoveredRepos.filter((repo) => {
    const repoLower = repo.toLowerCase();
    return variations.some((v) => v.length > 2 && (repoLower.includes(v) || v.includes(repoLower)));
  });
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
            '✅ [변경 관리 반영 완료]',
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
 * 모드 A: 두레이 태스크 + 사이트 생성 (매일 09:00 KST)
 */
async function runDooray() {
  console.log(`[${new Date().toISOString()}] Dooray poll started`);

  const doorayResult = await pollDoorayTasks();

  const sitePath = generateSite();
  console.log(`  Site generated: ${sitePath}`);

  console.log(`[${new Date().toISOString()}] Dooray poll complete. ${doorayResult.tasks.length} tasks.`);
}

/**
 * 모드 B: GHE 변경 감지 + 배포 사항 + 알림 + 사이트 생성 (매월 4주차 수요일 12:00 KST)
 */
async function runGHE() {
  console.log(`[${new Date().toISOString()}] GHE poll started`);

  let guideMapping = loadGuideMapping();
  const guides = loadGuides();
  const resolved = loadJSON(config.RESOLVED_FILE, { resolved: [] });
  console.log(`[Analyze] Loaded ${guides.length} guide files for keyword matching`);

  // 1. 두레이 태스크 조회 (guide-mapping 보강에 필요)
  const doorayResult = await pollDoorayTasks();

  // 2. 월별 배포 사항 조회 (GHE 변경 감지 시 컨텍스트로 사용)
  let deployResult = { fetchedAt: null, months: [] };
  try {
    deployResult = await pollDeployNotes();
  } catch (err) {
    console.error(`  [WARN] Deploy notes fetch failed: ${err.message}`);
  }

  // 3. GHE 변경 감지 + 키워드 분석 + 배포 사항 컨텍스트 첨부
  const gheResult = await pollGHE(guideMapping, guides, deployResult);

  // 4. guide-mapping 자동 보강
  const syncCount = syncGuideMapping(guideMapping, doorayResult.tasks, gheResult.discoveredRepos);
  if (syncCount > 0) {
    console.log(`  Auto-synced ${syncCount} guide mapping(s)`);
    guideMapping = loadGuideMapping();
  }

  // 5. GHE 결과 저장
  const existing = loadJSON(config.RESULTS_FILE, { lastPoll: null, heartbeat: null, changes: [], history: [] });
  existing.lastPoll = new Date().toISOString();
  existing.heartbeat = {
    timestamp: new Date().toISOString(),
    trackedRepos: gheResult.discoveredRepos.length,
    repoNames: gheResult.discoveredRepos,
  };
  if (gheResult.changes.length > 0) {
    const changesForHistory = gheResult.changes.map((c) => ({
      ...c,
      files: (c.files || []).map(({ patch, ...rest }) => rest),
    }));
    existing.history = [
      { pollDate: new Date().toISOString(), changes: changesForHistory },
      ...(existing.history || []),
    ];
  }
  existing.changes = gheResult.changes;
  saveJSON(config.RESULTS_FILE, existing);

  // 6. 7일 경과 미처리 건 리마인드 (사이트 생성 전에 데이터 반영)
  const remindCount = await sendReminders(existing, resolved);
  if (remindCount > 0) {
    saveJSON(config.RESULTS_FILE, existing);
    console.log(`  Sent ${remindCount} reminder(s)`);
  }

  // 7. PR 상태 추적
  const prUpdated = await checkPrStatuses(resolved);
  if (prUpdated > 0) {
    console.log(`  Updated ${prUpdated} PR status(es)`);
  }

  // 8. 사이트 생성 (알림 발송 전에 완료 — 웹훅 링크 클릭 시 최신 사이트가 보이도록)
  const sitePath = generateSite();
  console.log(`  Site generated: ${sitePath}`);

  // 9. 변경 관리 알림 발송 (사이트 생성 후 발송)
  await notifyUpdates(gheResult.changes, deployResult, resolved);

  console.log(`[${new Date().toISOString()}] GHE poll complete. ${gheResult.changes.length} GHE changes.`);
}

/**
 * 메인 실행 — 인자로 모드 선택
 *   dooray: 두레이 태스크 + 사이트 생성
 *   ghe:    GHE diff + 배포 사항 + 알림 + 사이트 생성
 *   (없음): 둘 다 실행 (수동 테스트용)
 */
async function runPoll(mode) {
  if (mode === 'dooray') return runDooray();
  if (mode === 'ghe') return runGHE();
  // 모드 미지정: 전체 실행
  await runDooray();
  await runGHE();
}

if (require.main === module) {
  const mode = process.argv[2] || '';
  runPoll(mode).catch(console.error);
}

module.exports = { runPoll, runDooray, runGHE };
