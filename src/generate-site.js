const fs = require('fs');
const path = require('path');
const config = require('./config');
const { loadJSON } = require('./state');
const { loadGuides, extractKeywordsFromText, findKeywordMatches } = require('./analyze');

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '--';
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function renderPage() {
  const tasks = loadJSON(config.DOORAY_TASKS_FILE, { fetchedAt: null, tasks: [] });
  const gheUpdates = loadJSON(config.RESULTS_FILE, { lastPoll: null, heartbeat: null, changes: [], history: [] });
  const deployNotes = loadJSON(config.DEPLOY_NOTES_FILE, { fetchedAt: null, months: [] });
  const resolved = loadJSON(config.RESOLVED_FILE, { resolved: [] });
  const guideMapping = loadJSON(config.GUIDE_MAPPING_FILE, { mappings: [] });

  const resolvedIds = new Set((resolved.resolved || []).map((r) => r.updateId));
  const resolvedGuideKeys = new Set((resolved.resolved || []).map((r) => r.updateId + '::' + (r.guide || '')));

  // === 섹션 1: 칸반보드 데이터 ===
  const stages = ['초안작성', '기술검토', '파트피어리뷰', '완료'];
  const kanban = {};
  stages.forEach((s) => (kanban[s] = []));

  for (const task of tasks.tasks) {
    const stage = task.stage || '초안작성';
    if (!kanban[stage]) kanban[stage] = [];
    kanban[stage].push(task);
  }

  // === 섹션 2: 현행화 목록 ===
  // GHE 변경 중 미해결 건
  const pendingGheChanges = (gheUpdates.history || [])
    .flatMap((h) => h.changes || [])
    .filter((c) => {
      if (!c.affectedGuides || c.affectedGuides.length === 0) return false;
      // 모든 가이드가 resolved된 카드는 제외
      const allResolved = c.affectedGuides.every((g) => resolvedGuideKeys.has(c.id + '::' + g.guide));
      return !allResolved;
    });

  // 배포 사항 중 영향 있는 건 (키워드 분석 + 가이드 단위 resolved 적용)
  const guides = loadGuides();
  const pendingDeployChanges = [];
  for (const month of deployNotes.months || []) {
    for (const svc of month.services || []) {
      if (!svc.affectedGuides || svc.affectedGuides.length === 0) continue;

      // 키워드 분석으로 실제 관련 가이드만 필터
      let filtered = svc.affectedGuides;
      const keywords = extractKeywordsFromText(svc.changes);
      if (keywords.length > 0 && guides.length > 0) {
        filtered = svc.affectedGuides.filter((ag) => {
          const guide = guides.find((g) => g.filename === ag.guide);
          if (!guide) return false;
          return findKeywordMatches(keywords, guide.content).length >= 2;
        });
      }

      if (filtered.length > 0) {
        const updateId = `deploy-${month.month}-${svc.service}`;
        const allResolved = filtered.every((g) => resolvedGuideKeys.has(updateId + '::' + g.guide));
        if (!allResolved) {
          pendingDeployChanges.push({ ...svc, affectedGuides: filtered, month: month.month, updateId });
        }
      }
    }
  }

  // === 통계 ===
  const totalTasks = tasks.tasks.length;
  const completedTasks = (kanban['완료'] || []).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingMaintenanceCount = pendingGheChanges.length + pendingDeployChanges.length;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NHN Cloud 실전 가이드</title>
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');
:root {
  --bg: #f5f6f8; --card: #ffffff; --border: #e5e7eb; --text: #111111;
  --text-muted: #727781; --primary: #125de6; --primary-hover: #1446c8;
  --primary-light: #e9f1ff;
  --success: #059669; --success-light: #d1fae5;
  --warning: #d97706; --warning-light: #fef3c7;
  --danger: #dc2626; --danger-light: #fee2e2;
  --stage-draft: #125de6; --stage-review: #d97706;
  --stage-peer: #059669; --stage-done: #727781;
  --control-border: #51565f; --dark: #111111;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; font-size: 16px; }
.container { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }

/* Header */
header { margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
header h1 { font-size: 22px; font-weight: 700; color: var(--dark); }
.header-links { display: flex; gap: 8px; }

/* Summary cards */
.summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
.summary-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; }
.summary-card .label { font-size: 13px; color: var(--text-muted); font-weight: 400; letter-spacing: 0.3px; margin-bottom: 6px; }
.summary-card .value { font-size: 28px; font-weight: 700; color: var(--dark); }
.summary-card .value.success { color: var(--success); }
.summary-card .value.warning { color: var(--warning); }
.summary-card .value.danger { color: var(--danger); }

/* Section headers */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.section-title { font-size: 17px; font-weight: 700; color: var(--dark); display: flex; align-items: center; gap: 8px; }
.section-title .badge { display: inline-block; padding: 2px 8px; border-radius: 30px; font-size: 11px; font-weight: 600; background: var(--primary); color: white; }
.section-divider { margin: 32px 0; border: none; border-top: 1px solid var(--border); }

/* Assignee filter */
.filter-bar { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-btn { padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); background: var(--card); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.filter-btn:hover { border-color: var(--primary); color: var(--primary); }
.filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

/* Hidden by filter */
.kanban-card.hidden { display: none; }
.maint-card.hidden { display: none; }

/* Kanban */
.kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
@media (max-width: 900px) { .kanban { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .kanban { grid-template-columns: 1fr; } }
.kanban-col { background: var(--bg); border-radius: 8px; padding: 12px; min-height: 200px; }
.kanban-col-header { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: var(--dark); }
.kanban-col-header .dot { width: 10px; height: 10px; border-radius: 50%; }
.kanban-col-header .count { margin-left: auto; font-size: 12px; color: var(--text-muted); font-weight: 400; background: var(--card); border: 1px solid var(--border); border-radius: 30px; padding: 0 8px; }
.kanban-card { background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; margin-bottom: 8px; font-size: 14px; transition: border-color 0.15s; }
.kanban-card:hover { border-color: var(--primary); }
.kanban-card .title { font-weight: 500; margin-bottom: 6px; line-height: 1.4; color: var(--dark); }
.kanban-card .meta { font-size: 12px; color: var(--text-muted); display: flex; gap: 8px; flex-wrap: wrap; }
.kanban-card .type-badge { display: inline-block; padding: 2px 8px; border-radius: 30px; font-size: 11px; font-weight: 500; }
.type-howto { background: var(--primary-light); color: var(--primary); }
.type-troubleshooting { background: var(--warning-light); color: var(--warning); }

/* Maintenance list */
.maint-section { margin-bottom: 24px; }
.maint-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: var(--dark); }
.maint-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 10px; transition: border-color 0.15s; }
.maint-card:hover { border-color: var(--control-border); }
.maint-card .source { font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 30px; margin-right: 8px; }
.maint-card .source.ghe { background: var(--primary-light); color: var(--primary); }
.maint-card .source.deploy { background: var(--warning-light); color: var(--warning); }
.maint-card .repo { font-weight: 600; font-size: 15px; color: var(--dark); }
.maint-card .changes { font-size: 14px; color: var(--text-muted); margin: 8px 0; }
.maint-card .affected { font-size: 14px; margin: 8px 0; }
.maint-card .affected li { margin-left: 16px; margin-bottom: 3px; }
.maint-card .actions { margin-top: 10px; display: flex; gap: 8px; }
.btn { padding: 8px 19px; border-radius: 30px; font-size: 14px; font-weight: 400; border: 1px solid var(--control-border); background: var(--card); color: var(--text-muted); cursor: pointer; text-decoration: none; transition: all 0.15s; }
.btn:hover { color: var(--primary); border-color: var(--primary); }
.btn-primary { background: var(--primary); color: white; border-color: var(--primary); }
.btn-primary:hover { background: var(--primary-hover); border-color: var(--primary-hover); color: white; }
.btn-success { background: var(--success); color: white; border-color: var(--success); }

/* Assignee workload */
.workload { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.workload-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; }
.workload-card .name { font-weight: 600; font-size: 15px; margin-bottom: 10px; color: var(--dark); }
.workload-bar { height: 6px; border-radius: 30px; background: var(--border); margin-bottom: 6px; overflow: hidden; }
.workload-bar-fill { height: 100%; border-radius: 30px; }
.workload-stats { font-size: 13px; color: var(--text-muted); display: flex; gap: 12px; }

/* Year groups (완료 열) */
.year-group { margin-bottom: 6px; }
.year-toggle { display: flex; align-items: center; gap: 6px; width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--card); cursor: pointer; font-size: 13px; font-weight: 600; color: var(--dark); transition: border-color 0.15s; }
.year-toggle:hover { border-color: var(--primary); }
.year-count { font-weight: 400; color: var(--text-muted); font-size: 12px; }
.year-arrow { margin-left: auto; font-size: 10px; color: var(--text-muted); transition: transform 0.2s; }
.year-toggle.open .year-arrow { transform: rotate(90deg); }
.year-cards { padding-top: 6px; }

/* Kanban collapse */
.kanban-card.collapsed { display: none; }
.kanban-toggle { margin-top: 4px; padding: 6px 0; text-align: center; font-size: 13px; color: var(--primary); cursor: pointer; border: none; background: none; width: 100%; transition: color 0.15s; }
.kanban-toggle:hover { color: var(--primary-hover); }

/* Guide check items */
.guide-check { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; }
.guide-check input[type="checkbox"] { margin-top: 3px; accent-color: var(--primary); width: 16px; height: 16px; cursor: pointer; }
.guide-check label { cursor: pointer; flex: 1; }
.guide-check label.checked { text-decoration: line-through; color: var(--text-muted); }
.guide-check .check-info { font-size: 12px; color: var(--text-muted); }
.maint-card.all-checked { opacity: 0.5; border-style: dashed; }
.maint-card .card-status { font-size: 12px; color: var(--success); margin-top: 8px; display: none; }

/* GitHub PAT setup */
.gh-setup { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; font-size: 14px; }
.gh-setup input { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; width: 320px; margin-right: 8px; }
.gh-setup .status { font-size: 13px; margin-top: 8px; }

/* Empty state */
.empty-state { text-align: center; padding: 48px 20px; color: var(--text-muted); }
.empty-state .icon { font-size: 40px; margin-bottom: 8px; }

footer { margin-top: 32px; text-align: center; font-size: 14px; color: var(--text-muted); padding-top: 16px; border-top: 1px solid var(--border); font-weight: 400; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>NHN Cloud 실전 가이드</h1>
    <div class="header-links">
      <a href="https://nhncloud.gitbook.io/partner" target="_blank" class="btn">실전 가이드</a>
      <a href="https://nhncorp.dooray.com/project/tasks/4254576973479504167" target="_blank" class="btn">월별 주요 배포 사항</a>
    </div>
  </header>

  <div class="section-header"><div class="section-title">주요 지표</div></div>
  <div class="summary">
    <div class="summary-card">
      <div class="label">전체 가이드</div>
      <div class="value">${totalTasks}</div>
    </div>
    <div class="summary-card">
      <div class="label">완료율</div>
      <div class="value ${completionRate >= 50 ? 'success' : 'warning'}">${completionRate}%</div>
    </div>
    <div class="summary-card">
      <div class="label">현행화 여부 확인 필요</div>
      <div class="value ${pendingMaintenanceCount > 0 ? 'danger' : 'success'}">${pendingMaintenanceCount}</div>
    </div>
    <div class="summary-card">
      <div class="label">추적 리포</div>
      <div class="value">${gheUpdates.heartbeat ? gheUpdates.heartbeat.trackedRepos : '--'}</div>
    </div>
  </div>

  <!-- 담당 문서 필터 -->
  <div class="section-header">
    <div class="section-title">실전 가이드 제작 작업 현황 <span class="badge">${totalTasks}</span></div>
    <div class="filter-bar">
      <button class="filter-btn active" data-assignee="all">전체</button>
      ${['하수진', '박선영', '박정현', '이종민'].map((name) => `<button class="filter-btn" data-assignee="${esc(name)}">${esc(name)}</button>`).join('')}
    </div>
  </div>

  <!-- 섹션 1: 칸반보드 -->
  <div class="kanban">
    ${stages.map((stage, i) => {
      const colors = ['var(--stage-draft)', 'var(--stage-review)', 'var(--stage-peer)', 'var(--stage-done)'];
      const cards = kanban[stage] || [];

      // 완료 열은 연도별 그룹
      if (stage === '완료') {
        const byYear = {};
        for (const t of cards) {
          const year = (t.updatedAt || '').substring(0, 4) || '미정';
          if (!byYear[year]) byYear[year] = [];
          byYear[year].push(t);
        }
        const years = Object.keys(byYear).sort().reverse();

        return `
    <div class="kanban-col" data-stage="${esc(stage)}">
      <div class="kanban-col-header">
        <span class="dot" style="background:${colors[i]}"></span>
        ${esc(stage)}
        <span class="count" data-stage="${esc(stage)}">${cards.length}</span>
      </div>
      ${cards.length === 0 ? '<div class="empty-col" style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px 0;">없음</div>' : ''}
      ${years.map((year) => {
        const yearCards = byYear[year];
        return `
      <div class="year-group">
        <button class="year-toggle" data-year="${esc(year)}">
          <span class="year-label">${esc(year)}년</span>
          <span class="year-count">${yearCards.length}건</span>
          <span class="year-arrow">&#9654;</span>
        </button>
        <div class="year-cards" style="display:none;">
          ${yearCards.map((t) => `
          <div class="kanban-card" data-task-id="${esc(t.id)}" data-assignees="${esc(t.assignees.join(','))}">
            <div class="title">${esc(t.title.replace(/^\[(How-to|Troubleshooting)\]\s*/, ''))}</div>
            <div class="meta">
              <span class="type-badge ${t.type === 'How-to' ? 'type-howto' : 'type-troubleshooting'}">${esc(t.type)}</span>
              <span>${esc(t.assignees.join(', '))}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>`;
      }).join('')}
    </div>`;
      }

      // 나머지 열은 기존 방식
      return `
    <div class="kanban-col" data-stage="${esc(stage)}">
      <div class="kanban-col-header">
        <span class="dot" style="background:${colors[i]}"></span>
        ${esc(stage)}
        <span class="count" data-stage="${esc(stage)}">${cards.length}</span>
      </div>
      ${cards.length === 0 ? '<div class="empty-col" style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px 0;">없음</div>' : ''}
      ${cards.map((t) => `
      <div class="kanban-card" data-task-id="${esc(t.id)}" data-assignees="${esc(t.assignees.join(','))}">
        <div class="title">${esc(t.title.replace(/^\[(How-to|Troubleshooting)\]\s*/, ''))}</div>
        <div class="meta">
          <span class="type-badge ${t.type === 'How-to' ? 'type-howto' : 'type-troubleshooting'}">${esc(t.type)}</span>
          <span>${esc(t.assignees.join(', '))}</span>
        </div>
      </div>`).join('')}
      ${cards.length > 5 ? `<button class="kanban-toggle">+${cards.length - 5}건 더 보기</button>` : ''}
    </div>`;
    }).join('')}
  </div>

  <hr class="section-divider">

  <!-- 섹션 2: 현행화 -->
  <div class="section-header">
    <div class="section-title">실전 가이드 현행화 작업 ${pendingMaintenanceCount > 0 ? `<span class="badge">${pendingMaintenanceCount}</span>` : ''}</div>
  </div>

  <div class="gh-setup" id="gh-setup">
    <strong>GitHub 연결</strong> — 확인 완료 처리를 위해 GitHub 토큰이 필요합니다. (최초 1회)
    <div style="margin-top:8px;">
      <input type="password" id="gh-pat" placeholder="GitHub Personal Access Token">
      <button class="btn" id="gh-save">저장</button>
    </div>
    <div class="status" id="gh-status"></div>
  </div>

  ${pendingGheChanges.length === 0 && pendingDeployChanges.length === 0 ? `
  <div class="empty-state">
    <div class="icon">&#10003;</div>
    <p>현행화가 필요한 항목이 없습니다.</p>
  </div>` : ''}

  ${pendingGheChanges.length > 0 ? `
  <div class="maint-section">
    <h3>사용자 가이드 변경 감지</h3>
    ${pendingGheChanges.map((c) => {
      const assigneeList = (c.affectedGuides || []).map((g) => g.assignee).join(',');
      return `
    <div class="maint-card" data-update-id="${esc(c.id)}" data-assignees="${esc(assigneeList)}">
      <div><span class="source ghe">cloud-docs</span><span class="repo">${esc(c.repo)}</span></div>
      <div class="changes">${esc(c.files ? c.files.map((f) => f.filename).join(', ') : '')}</div>
      <div class="affected"><strong>확인이 필요한 가이드:</strong>
        ${(c.affectedGuides || []).map((g) => {
          const checkId = esc(c.id) + '::' + esc(g.guide);
          const desc = g.matches && g.matches.length > 0
            ? `변경 diff에서 [${g.matches.map((m) => esc(m.keyword)).join(', ')}] 키워드가 확인되었으며, 해당 가이드에서도 동일 키워드를 포함하고 있어 변경 필요 여부를 확인해 주세요.`
            : `동일 서비스의 문서가 변경되었습니다. 가이드 내용에 영향이 있는지 확인해 주세요.`;
          return `
        <div class="guide-check">
          <input type="checkbox" id="chk-${checkId}" data-update-id="${esc(c.id)}" data-guide="${esc(g.guide)}" onchange="onGuideCheck(this)">
          <label for="chk-${checkId}">
            ${esc(g.title)} <span style="color:var(--text-muted)">(${esc(g.assignee)})</span>
            <div class="check-info">${desc}</div>
          </label>
        </div>`;
        }).join('')}
      </div>
      <div style="margin-top:8px;">${c.compareUrl ? `<a href="${esc(c.compareUrl)}" target="_blank" class="btn">diff 보기</a>` : ''}</div>
      <div class="card-status"></div>
    </div>`;
    }).join('')}
  </div>` : ''}

  ${pendingDeployChanges.length > 0 ? `
  <div class="maint-section">
    <h3>월별 배포 사항</h3>
    ${pendingDeployChanges.map((c) => {
      const assigneeList = (c.affectedGuides || []).map((g) => g.assignee).join(',');
      return `
    <div class="maint-card" data-update-id="${esc(c.updateId)}" data-assignees="${esc(assigneeList)}">
      <div><span class="source deploy">${esc(c.month)}</span><span class="repo">${esc(c.service)}</span></div>
      <div class="changes">${esc(c.changes)}</div>
      <div class="affected"><strong>확인이 필요한 가이드:</strong>
        ${(c.affectedGuides || []).map((g) => {
          const checkId = esc(c.updateId) + '::' + esc(g.guide);
          return `
        <div class="guide-check">
          <input type="checkbox" id="chk-${checkId}" data-update-id="${esc(c.updateId)}" data-guide="${esc(g.guide)}" onchange="onGuideCheck(this)">
          <label for="chk-${checkId}">
            ${esc(g.title)} <span style="color:var(--text-muted)">(${esc(g.assignee)})</span>
            <div class="check-info">동일 서비스의 배포 사항이 확인되었습니다. 가이드 내용에 영향이 있는지 확인해 주세요.</div>
          </label>
        </div>`;
        }).join('')}
      </div>
      <div style="margin-top:8px;">${c.releaseNoteUrl ? `<a href="${esc(c.releaseNoteUrl)}" target="_blank" class="btn">릴리스 노트</a>` : ''}</div>
      <div class="card-status"></div>
    </div>`;
    }).join('')}
  </div>` : ''}

  <footer>매일 09:00 KST 자동 갱신 · 마지막 갱신: ${formatDate(tasks.fetchedAt || gheUpdates.lastPoll)} · 마지막 생성: ${formatDate(new Date().toISOString())}</footer>
</div>

<script>
// === GitHub PAT 설정 ===
const GH_REPO = 'TOAST-DOCS/TW';
const RESOLVED_PATH = 'data/resolved.json';

(function initGhSetup() {
  const pat = localStorage.getItem('gh-pat');
  const setupEl = document.getElementById('gh-setup');
  if (pat) {
    setupEl.innerHTML = '<span style="color:var(--success);">GitHub 연결됨</span> <button class="btn" onclick="localStorage.removeItem(\\'gh-pat\\');location.reload();" style="font-size:12px;">연결 해제</button>';
  }
  const saveBtn = document.getElementById('gh-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const val = document.getElementById('gh-pat').value.trim();
      if (!val) return;
      localStorage.setItem('gh-pat', val);
      location.reload();
    });
  }
})();

// === 가이드별 확인 완료 체크 ===
async function onGuideCheck(checkbox) {
  const pat = localStorage.getItem('gh-pat');
  if (!pat) {
    checkbox.checked = false;
    alert('GitHub 토큰을 먼저 설정해 주세요.');
    return;
  }
  if (!checkbox.checked) return; // 체크 해제는 무시

  const updateId = checkbox.dataset.updateId;
  const guide = checkbox.dataset.guide;
  const label = checkbox.nextElementSibling;
  const card = checkbox.closest('.maint-card');
  const statusEl = card.querySelector('.card-status');

  checkbox.disabled = true;
  label.classList.add('checked');

  try {
    // 1. 현재 resolved.json 읽기
    const headers = { Authorization: 'token ' + pat, Accept: 'application/vnd.github+json' };
    const getRes = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + RESOLVED_PATH, { headers });

    let resolved = { resolved: [] };
    let sha = null;

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      resolved = JSON.parse(atob(data.content));
    }

    // 2. 중복 체크
    if (resolved.resolved.some(r => r.updateId === updateId && r.guide === guide)) {
      // 이미 처리됨 — UI만 유지
      return;
    }

    // 3. 새 항목 추가
    resolved.resolved.push({
      updateId: updateId,
      guide: guide,
      resolvedBy: '대시보드',
      resolvedAt: new Date().toISOString()
    });

    // 4. 커밋
    const putRes = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + RESOLVED_PATH, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'chore: 현행화 확인 완료 - ' + guide.split('/').pop(),
        content: btoa(unescape(encodeURIComponent(JSON.stringify(resolved, null, 2)))),
        sha: sha
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || putRes.statusText);
    }

    // 5. 카드 내 모든 체크박스 확인 → 전부 체크되면 카드 제거
    const allChecks = card.querySelectorAll('input[type="checkbox"]');
    const allDone = [...allChecks].every(c => c.checked);
    if (allDone) {
      statusEl.textContent = '모든 가이드 확인 완료';
      statusEl.style.display = 'block';
      setTimeout(() => { card.classList.add('all-checked'); }, 500);
    }

  } catch (err) {
    checkbox.checked = false;
    checkbox.disabled = false;
    label.classList.remove('checked');
    alert('오류: ' + err.message);
  }
}

// === 완료 열 연도별 접기/펼치기 ===
document.querySelectorAll('.year-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    const cards = btn.nextElementSibling;
    cards.style.display = cards.style.display === 'none' ? 'block' : 'none';
  });
});

// === 칸반 5행 접기/펼치기 ===
const MAX_VISIBLE = 5;
document.querySelectorAll('.kanban-col').forEach(col => {
  const cards = col.querySelectorAll('.kanban-card');
  const toggle = col.querySelector('.kanban-toggle');
  if (cards.length <= MAX_VISIBLE || !toggle) return;

  // 초기: 5개 초과 숨김
  cards.forEach((c, i) => { if (i >= MAX_VISIBLE) c.classList.add('collapsed'); });

  let expanded = false;
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    cards.forEach((c, i) => {
      if (i >= MAX_VISIBLE) c.classList.toggle('collapsed', !expanded);
    });
    toggle.textContent = expanded ? '접기' : '+' + (cards.length - MAX_VISIBLE) + '건 더 보기';
  });
});

// 담당 문서 필터
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const assignee = btn.dataset.assignee;

    // 칸반 카드 필터
    document.querySelectorAll('.kanban-card').forEach(card => {
      if (assignee === 'all') {
        card.classList.remove('hidden');
      } else {
        const assignees = card.dataset.assignees || '';
        card.classList.toggle('hidden', !assignees.includes(assignee));
      }
    });

    // 현행화 카드 필터
    document.querySelectorAll('.maint-card').forEach(card => {
      if (assignee === 'all') {
        card.classList.remove('hidden');
      } else {
        const assignees = card.dataset.assignees || '';
        card.classList.toggle('hidden', !assignees.includes(assignee));
      }
    });

    // 칸반 열 카운트 갱신
    document.querySelectorAll('.kanban-col').forEach(col => {
      const visible = col.querySelectorAll('.kanban-card:not(.hidden)').length;
      const countEl = col.querySelector('.count');
      if (countEl) countEl.textContent = visible;
    });
  });
});
</script>
</body>
</html>`;
}

function generateSite() {
  const outPath = path.resolve(__dirname, '..', config.SITE_FILE);
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = renderPage();
  fs.writeFileSync(outPath, html, 'utf-8');
  return outPath;
}

module.exports = { generateSite };
