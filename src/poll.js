const { discoverRepos, getBranch, hasTargetDir, getChangedFiles } = require('./github');
const { fetchGuideTasks, fetchDeployNotes, sendWebhook } = require('./dooray');
const { loadState, saveState, loadJSON, saveJSON } = require('./state');
const { generateSite } = require('./generate-site');
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
async function pollGHE(guideMapping) {
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
        const affected = findAffectedGuides(repoName, guideMapping.mappings);
        changes.push({
          id: `ghe-${repoName}-${Date.now()}`,
          source: 'ghe',
          repo: repoName,
          previousSha: repoState.lastSha,
          currentSha,
          compareUrl: diff.compareUrl,
          mdChanges: diff.mdChanges,
          files: diff.files,
          affectedGuides: affected,
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

  // 각 서비스에 영향받는 가이드 매핑
  for (const month of months) {
    for (const svc of month.services) {
      const affected = guideMapping.mappings.filter((m) =>
        m.service.toLowerCase().includes(svc.service.toLowerCase()) ||
        svc.service.toLowerCase().includes(m.service.toLowerCase())
      );
      svc.affectedGuides = affected.map((m) => ({
        guide: m.guide,
        title: m.title,
        assignee: m.assignee,
      }));
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
  const resolvedIds = new Set((resolved.resolved || []).map((r) => r.updateId));

  // GHE 변경 알림
  for (const change of gheChanges) {
    if (resolvedIds.has(change.id)) continue;
    if (change.affectedGuides.length === 0) continue;

    const guideList = change.affectedGuides.map((g) => `• ${g.title}`).join('\n');
    const message = [
      '📢 [실전 가이드 현행화 알림]',
      '',
      `서비스: ${change.repo}`,
      `변경: ko/ 디렉토리 내 ${change.mdChanges}개 파일 변경`,
      '',
      '영향받는 가이드:',
      guideList,
      '',
      `👉 대시보드에서 확인: ${config.DASHBOARD_URL}`,
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
 * 메인 실행
 */
async function runPoll() {
  console.log(`[${new Date().toISOString()}] Poll started`);

  const guideMapping = loadGuideMapping();
  const resolved = loadJSON(config.RESOLVED_FILE, { resolved: [] });

  // 1. 두레이 태스크 조회
  const doorayResult = await pollDoorayTasks();

  // 2. GHE 변경 감지
  const gheResult = await pollGHE(guideMapping);

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
  const deployResult = await pollDeployNotes(guideMapping);

  // 5. 현행화 알림 발송
  await notifyUpdates(gheResult.changes, deployResult, resolved);

  // 6. 사이트 생성
  const sitePath = generateSite();
  console.log(`  Site generated: ${sitePath}`);

  console.log(`[${new Date().toISOString()}] Poll complete. ${gheResult.changes.length} GHE changes, ${doorayResult.tasks.length} tasks.`);
}

if (require.main === module) {
  runPoll().catch(console.error);
}

module.exports = { runPoll };
