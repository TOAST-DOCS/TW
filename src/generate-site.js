const fs = require('fs');
const path = require('path');
const config = require('./config');
const { loadJSON } = require('./state');

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
    .filter((c) => !resolvedIds.has(c.id) && c.affectedGuides && c.affectedGuides.length > 0);

  // 배포 사항 중 영향 있는 건
  const pendingDeployChanges = [];
  for (const month of deployNotes.months || []) {
    for (const svc of month.services || []) {
      if (svc.affectedGuides && svc.affectedGuides.length > 0) {
        const updateId = `deploy-${month.month}-${svc.service}`;
        if (!resolvedIds.has(updateId)) {
          pendingDeployChanges.push({ ...svc, month: month.month, updateId });
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
<title>NHN Cloud 실전 가이드 대시보드</title>
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
.header-meta { font-size: 14px; color: var(--text-muted); font-weight: 400; }

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

/* Kanban collapse */
.kanban-card.collapsed { display: none; }
.kanban-toggle { margin-top: 4px; padding: 6px 0; text-align: center; font-size: 13px; color: var(--primary); cursor: pointer; border: none; background: none; width: 100%; transition: color 0.15s; }
.kanban-toggle:hover { color: var(--primary-hover); }

/* Empty state */
.empty-state { text-align: center; padding: 48px 20px; color: var(--text-muted); }
.empty-state .icon { font-size: 40px; margin-bottom: 8px; }

footer { margin-top: 32px; text-align: center; font-size: 14px; color: var(--text-muted); padding-top: 16px; border-top: 1px solid var(--border); font-weight: 400; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>NHN Cloud 실전 가이드 대시보드</h1>
    <div class="header-meta">마지막 갱신: ${formatDate(tasks.fetchedAt || gheUpdates.lastPoll)}</div>
  </header>

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
      <div class="label">현행화 필요</div>
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
      <div class="affected"><strong>영향받는 가이드:</strong>
        <ul>${(c.affectedGuides || []).map((g) => `<li>${esc(g.title)} (${esc(g.assignee)})</li>`).join('')}</ul>
      </div>
      <div class="actions">
        ${c.compareUrl ? `<a href="${esc(c.compareUrl)}" target="_blank" class="btn">diff 보기</a>` : ''}
      </div>
    </div>`;
    }).join('')}
  </div>` : ''}

  ${pendingDeployChanges.length > 0 ? `
  <div class="maint-section">
    <h3><span class="source deploy">배포</span> 월별 배포 사항</h3>
    ${pendingDeployChanges.map((c) => {
      const assigneeList = (c.affectedGuides || []).map((g) => g.assignee).join(',');
      return `
    <div class="maint-card" data-update-id="${esc(c.updateId)}" data-assignees="${esc(assigneeList)}">
      <div><span class="source deploy">${esc(c.month)}</span><span class="repo">${esc(c.service)}</span></div>
      <div class="changes">${esc(c.changes)}</div>
      <div class="affected"><strong>영향받는 가이드:</strong>
        <ul>${(c.affectedGuides || []).map((g) => `<li>${esc(g.title)} (${esc(g.assignee)})</li>`).join('')}</ul>
      </div>
      <div class="actions">
        ${c.releaseNoteUrl ? `<a href="${esc(c.releaseNoteUrl)}" target="_blank" class="btn">릴리스 노트</a>` : ''}
      </div>
    </div>`;
    }).join('')}
  </div>` : ''}

  <footer>매일 09:00 KST 자동 갱신 · 마지막 생성: ${formatDate(new Date().toISOString())}</footer>
</div>

<script>
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
