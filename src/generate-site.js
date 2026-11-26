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

/**
 * deployContext에서 가이드 publishedAt 이전 월을 제거
 */
function filterDeployContext(deployCtx, affectedGuides, guideMappings) {
  if (!deployCtx || deployCtx.length === 0 || !affectedGuides || affectedGuides.length === 0) return deployCtx || [];
  const publishDates = affectedGuides
    .map((g) => {
      const mapping = guideMappings.find((m) => m.guide === g.guide);
      return mapping && mapping.publishedAt ? mapping.publishedAt.substring(0, 7) : null;
    })
    .filter(Boolean);
  if (publishDates.length === 0) return deployCtx;
  const cutoffMonth = publishDates.sort().pop();
  return deployCtx.filter((ctx) => ctx.month > cutoffMonth);
}

function renderPage() {
  const tasks = loadJSON(config.DOORAY_TASKS_FILE, { fetchedAt: null, tasks: [] });
  const gheUpdates = loadJSON(config.RESULTS_FILE, { lastPoll: null, heartbeat: null, changes: [], history: [] });
  const resolved = loadJSON(config.RESOLVED_FILE, { resolved: [] });
  const guideMapping = loadJSON(config.GUIDE_MAPPING_FILE, { mappings: [] });

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

  // === 섹션 2: 변경 관리 목록 ===
  // GHE 변경 중 미해결 건
  const pendingGheChanges = (gheUpdates.history || [])
    .flatMap((h) => h.changes || [])
    .filter((c) => {
      if (!c.affectedGuides || c.affectedGuides.length === 0) return false;
      // 모든 가이드가 resolved된 카드는 제외
      const allResolved = c.affectedGuides.every((g) => resolvedGuideKeys.has(c.id + '::' + g.guide));
      return !allResolved;
    });

  // === 마일스톤 목록 ===
  const milestoneSet = new Map();
  for (const task of tasks.tasks) {
    if (task.milestone) {
      milestoneSet.set(task.milestone.name, (milestoneSet.get(task.milestone.name) || 0) + 1);
    }
  }
  const milestoneNames = [...milestoneSet.keys()].sort();

  // === 통계 ===
  const totalTasks = tasks.tasks.length;
  const pendingMaintenanceCount = pendingGheChanges.length;

  // 전체 완료율
  const totalDone = tasks.tasks.filter((t) => t.stage === '완료').length;
  const totalRate = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  // 현재 마일스톤 완료율 (조회 시점 기준)
  const now = new Date();
  const currentHalf = now.getMonth() < 6 ? '상반기' : '하반기';
  const currentMilestoneName = `${now.getFullYear()}년 ${currentHalf}`;
  const currentMsTasks = tasks.tasks.filter((t) => t.milestone && t.milestone.name === currentMilestoneName);
  const currentMsDone = currentMsTasks.filter((t) => t.stage === '완료').length;
  const currentMsTotal = currentMsTasks.length;
  const currentMsRate = currentMsTotal > 0 ? Math.round((currentMsDone / currentMsTotal) * 100) : 0;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NHN Cloud 실전 가이드 작업 대시보드</title>
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

/* Global summary bar */
.global-summary { display: flex; align-items: center; gap: 0; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 14px 24px; margin-bottom: 24px; flex-wrap: wrap; }
.global-summary .gs-group { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.global-summary .gs-divider { width: 1px; height: 28px; background: var(--border); margin: 0 24px; flex-shrink: 0; }
.global-summary .gs-item { display: flex; align-items: baseline; gap: 6px; font-size: 14px; color: var(--text-muted); white-space: nowrap; }
.global-summary .gs-value { font-size: 18px; font-weight: 700; color: var(--dark); }
.global-summary .gs-value.success { color: var(--success); }
.global-summary .gs-value.warning { color: var(--warning); }
.global-summary .gs-value.danger { color: var(--danger); }
.global-summary .gs-sub { font-size: 13px; color: var(--text-muted); margin-left: 2px; }
.global-summary .gs-sub strong { font-weight: 700; }
.global-summary .gs-sub strong.success { color: var(--success); }
.global-summary .gs-sub strong.warning { color: var(--warning); }
.gs-progress { display: inline-block; width: 80px; height: 8px; background: var(--border); border-radius: 30px; vertical-align: middle; margin-left: 8px; overflow: hidden; }
.gs-progress-fill { height: 100%; border-radius: 30px; transition: width 0.3s; }
@media (max-width: 700px) { .global-summary { flex-direction: column; align-items: flex-start; gap: 12px; } .global-summary .gs-divider { width: 100%; height: 1px; margin: 4px 0; } }

/* Tabs */
.tab-bar { display: flex; gap: 0; margin-bottom: 24px; border-bottom: 2px solid var(--border); }
.tab-btn { padding: 14px 28px; font-size: 17px; font-weight: 700; color: var(--text-muted); background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; cursor: pointer; transition: all 0.15s; }
.tab-btn:hover { color: var(--primary); background: var(--primary-light); }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: var(--primary-light); }
.tab-btn .tab-badge { display: inline-block; padding: 2px 8px; border-radius: 30px; font-size: 12px; font-weight: 600; background: var(--danger); color: white; margin-left: 6px; vertical-align: middle; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* Summary row (inside tabs) */
.summary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
@media (max-width: 700px) { .summary-row { grid-template-columns: 1fr; } }
.summary-group { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; }
.summary-group-label { font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.3px; margin-bottom: 12px; text-transform: uppercase; }

/* Summary cards */
.summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
.summary-card { background: var(--bg); border-radius: 6px; padding: 14px 16px; }
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

/* Filter dropdowns */
.filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-dropdown { position: relative; }
.filter-toggle { padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); background: var(--card); color: var(--text-muted); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
.filter-toggle:hover { border-color: var(--primary); color: var(--primary); }
.filter-toggle.active { background: var(--primary); color: white; border-color: var(--primary); }
.filter-toggle .arrow { font-size: 10px; transition: transform 0.2s; }
.filter-toggle.open .arrow { transform: rotate(180deg); }
.filter-menu { display: none; position: absolute; top: calc(100% + 4px); left: 0; min-width: 180px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 100; padding: 4px 0; }
.filter-menu.open { display: block; }
.filter-menu-item { padding: 8px 16px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--text); transition: background 0.1s; }
.filter-menu-item:hover { background: var(--bg); }
.filter-menu-item.selected { color: var(--primary); font-weight: 600; }
.filter-menu-item .item-count { font-size: 12px; color: var(--text-muted); font-weight: 400; }

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
.milestone-badge { display: inline-block; padding: 2px 8px; border-radius: 30px; font-size: 11px; font-weight: 500; background: var(--success-light); color: var(--success); }

/* Maintenance list */
.maint-section { margin-bottom: 24px; }
.maint-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: var(--dark); }
.maint-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 10px; transition: border-color 0.15s; }
.maint-card:hover { border-color: var(--control-border); }
.maint-card .source { font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 30px; margin-right: 8px; }
.maint-card .source.ghe { background: var(--primary-light); color: var(--primary); }
.maint-card .source.deploy { background: var(--warning-light); color: var(--warning); }
.deploy-context { font-size: 13px; color: var(--text-muted); margin: 8px 0; padding: 8px 12px; background: var(--bg); border-radius: 6px; }
.deploy-ctx-item { display: block; margin-top: 4px; }
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
.btn-sm { padding: 4px 12px; font-size: 12px; }
.guide-check { position: relative; }
.guide-check .btn-sm { margin-top: 4px; }

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
    <div>
      <h1>NHN Cloud 실전 가이드 작업 대시보드</h1>
      <p style="font-size:13px;color:var(--text-muted);margin-top:2px;">NHN Cloud 에셋파트</p>
    </div>
    <div class="header-links">
      <a href="https://nhncloud.gitbook.io/partner" target="_blank" class="btn">실전 가이드</a>
      <a href="https://nhncorp.dooray.com/project/tasks/4254576973479504167" target="_blank" class="btn">월별 주요 배포 사항</a>
    </div>
  </header>

  <!-- 요약 바 -->
  <div class="global-summary">
    <div class="gs-item">전체 진행 중인 작업 <span class="gs-value">${totalTasks}</span>건<span class="gs-sub">(완료율 <strong class="${totalRate >= 50 ? 'success' : 'warning'}">${totalRate}%</strong> · ${totalDone}/${totalTasks})</span><span class="gs-progress"><span class="gs-progress-fill" style="width:${totalRate}%;background:var(--${totalRate >= 50 ? 'success' : 'warning'})"></span></span></div>
    <div class="gs-divider"></div>
    ${currentMsTotal > 0 ? `
    <div class="gs-item">${esc(currentMilestoneName)} 타깃 작업 <span class="gs-value">${currentMsTotal}</span>건<span class="gs-sub">(완료율 <strong class="${currentMsRate >= 50 ? 'success' : 'warning'}">${currentMsRate}%</strong> · ${currentMsDone}/${currentMsTotal})</span><span class="gs-progress"><span class="gs-progress-fill" style="width:${currentMsRate}%;background:var(--${currentMsRate >= 50 ? 'success' : 'warning'})"></span></span></div>
    <div class="gs-divider"></div>
    ` : ''}
    <div class="gs-item">변경 관리 <span class="gs-value ${pendingMaintenanceCount > 0 ? 'danger' : 'success'}">${pendingMaintenanceCount}</span>건 확인 필요</div>
  </div>

  <!-- 탭 -->
  <div class="tab-bar">
    <button class="tab-btn active" data-tab="production">제작 작업 현황 <span class="tab-badge" style="background:var(--primary)">${totalTasks}</span></button>
    <button class="tab-btn" data-tab="maintenance">변경 관리${pendingMaintenanceCount > 0 ? ` <span class="tab-badge">${pendingMaintenanceCount}</span>` : ''}</button>
  </div>

  <!-- 탭 1: 제작 현황 -->
  <div class="tab-panel active" id="tab-production">

  <div class="section-header">
    <div class="filter-bar">
      <div class="filter-dropdown" data-filter-group="assignee">
        <button class="filter-toggle" id="assignee-toggle">작업자별 보기 <span class="arrow">&#9662;</span></button>
        <div class="filter-menu" id="assignee-menu">
          <div class="filter-menu-item selected" data-value="all">전체 <span class="item-count">${totalTasks}</span></div>
          ${(() => {
            const counts = {};
            for (const t of tasks.tasks) { for (const a of t.assignees) { counts[a] = (counts[a] || 0) + 1; } }
            const members = ['박선영', '박정현', '이종민', '하수진'];
            return members.sort().map((name) =>
              `<div class="filter-menu-item" data-value="${esc(name)}">${esc(name)} <span class="item-count">${counts[name] || 0}</span></div>`
            ).join('');
          })()}
        </div>
      </div>
      ${milestoneNames.length > 0 ? `
      <div class="filter-dropdown" data-filter-group="milestone">
        <button class="filter-toggle" id="milestone-toggle">타깃 일정별 보기 <span class="arrow">&#9662;</span></button>
        <div class="filter-menu" id="milestone-menu">
          <div class="filter-menu-item selected" data-value="all">전체 <span class="item-count">${totalTasks}</span></div>
          ${milestoneNames.map((name) => `<div class="filter-menu-item" data-value="${esc(name)}">${esc(name)} <span class="item-count">${milestoneSet.get(name)}</span></div>`).join('')}
        </div>
      </div>` : ''}
      <div class="filter-dropdown" data-filter-group="type">
        <button class="filter-toggle" id="type-toggle">유형별 보기 <span class="arrow">&#9662;</span></button>
        <div class="filter-menu" id="type-menu">
          <div class="filter-menu-item selected" data-value="all">전체 <span class="item-count">${totalTasks}</span></div>
          ${(() => {
            const typeCounts = {};
            for (const t of tasks.tasks) { typeCounts[t.type] = (typeCounts[t.type] || 0) + 1; }
            return ['How-to', 'Troubleshooting'].map((type) =>
              `<div class="filter-menu-item" data-value="${esc(type)}">${esc(type)} <span class="item-count">${typeCounts[type] || 0}</span></div>`
            ).join('');
          })()}
        </div>
      </div>
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
          <div class="kanban-card" data-task-id="${esc(t.id)}" data-assignees="${esc(t.assignees.join(','))}" data-milestone="${esc(t.milestone ? t.milestone.name : '')}" data-type="${esc(t.type || '')}">
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
      <div class="kanban-card" data-task-id="${esc(t.id)}" data-assignees="${esc(t.assignees.join(','))}" data-milestone="${esc(t.milestone ? t.milestone.name : '')}" data-type="${esc(t.type || '')}">
        <div class="title">${esc(t.title.replace(/^\[(How-to|Troubleshooting)\]\s*/, ''))}</div>
        <div class="meta">
          <span class="type-badge ${t.type === 'How-to' ? 'type-howto' : 'type-troubleshooting'}">${esc(t.type)}</span>
          <span>${esc(t.assignees.join(', '))}</span>
        </div>
      </div>`).join('')}
      ${cards.length > 10 ? `<button class="kanban-toggle">+${cards.length - 10}건 더 보기</button>` : ''}
    </div>`;
    }).join('')}
  </div>

  </div><!-- /tab-production -->

  <!-- 탭 2: 변경 관리 -->
  <div class="tab-panel" id="tab-maintenance">

  ${pendingGheChanges.length === 0 ? `
  <div class="empty-state">
    <div class="icon">&#10003;</div>
    <p>변경 관리가 필요한 항목이 없습니다.</p>
  </div>` : ''}

  ${pendingGheChanges.length > 0 ? `
  <div class="maint-section">
    ${pendingGheChanges.map((c) => {
      const assigneeList = (c.affectedGuides || []).map((g) => g.assignee).join(',');
      const deployCtx = filterDeployContext(c.deployContext, c.affectedGuides, guideMapping.mappings);
      return `
    <div class="maint-card" data-update-id="${esc(c.id)}" data-assignees="${esc(assigneeList)}">
      <div><span class="source ghe">cloud-docs</span><span class="repo">${esc(c.repo)}</span></div>
      <div class="changes">${esc(c.files ? c.files.map((f) => f.filename).join(', ') : '')}</div>
      ${deployCtx.length > 0 ? `<div class="deploy-context"><strong>관련 배포 사항:</strong> ${deployCtx.map((ctx) => `<span class="deploy-ctx-item">[${esc(ctx.month)}] ${esc(ctx.changes.substring(0, 120))}</span>`).join('')}</div>` : ''}
      <div class="affected"><strong>확인이 필요한 가이드:</strong>
        ${(c.affectedGuides || []).map((g) => {
          const checkId = esc(c.id) + '::' + esc(g.guide);
          const desc = g.matches && g.matches.length > 0
            ? `변경 diff에서 [${g.matches.map((m) => esc(m.keyword)).join(', ')}] 키워드가 확인되었으며, 해당 가이드에서도 동일 키워드를 포함하고 있어 변경 필요 여부를 확인해 주세요.`
            : `동일 서비스의 문서가 변경되었습니다. 가이드 내용에 영향이 있는지 확인해 주세요.`;
          const kwStr = g.matches && g.matches.length > 0 ? g.matches.map((m) => esc(m.keyword)).join(', ') : '';
          return `
        <div class="guide-check">
          <input type="checkbox" id="chk-${checkId}" data-update-id="${esc(c.id)}" data-guide="${esc(g.guide)}" onchange="onGuideCheck(this)">
          <label for="chk-${checkId}">
            ${esc(g.title)} <span style="color:var(--text-muted)">(${esc(g.assignee)})</span>
            <div class="check-info">${desc}</div>
          </label>
          <button class="btn btn-primary btn-sm" onclick="onStartUpdate(this)" data-source="ghe" data-service="${esc(c.repo)}" data-summary="${esc(c.files ? c.files.map((f) => f.filename).join(', ') : '')}" data-patches="${esc(JSON.stringify((c.files || []).map((f) => ({ filename: f.filename, patch: f.patch || '' }))))}" data-diff-url="${esc(c.compareUrl || '')}" data-keywords="${esc(kwStr)}" data-deploy-context="${esc(JSON.stringify(deployCtx))}" data-update-id="${esc(c.id)}" data-guide="${esc(g.guide)}" data-guide-title="${esc(g.title)}" data-guide-assignee="${esc(g.assignee)}">현행화 프롬프트 복사</button>
        </div>`;
        }).join('')}
      </div>
      <div style="margin-top:8px;">${c.compareUrl ? `<a href="${esc(c.compareUrl)}" target="_blank" class="btn">diff 보기</a>` : ''}</div>
      <div class="card-status"></div>
    </div>`;
    }).join('')}
  </div>` : ''}

  <div class="gh-setup" id="gh-setup" style="display:none;">
    <strong>GitHub 연결</strong> — 확인 완료 처리를 위해 GitHub 토큰이 필요합니다. (최초 1회)
    <div style="margin-top:8px;">
      <input type="password" id="gh-pat" placeholder="GitHub Personal Access Token">
      <button class="btn" id="gh-save">저장</button>
    </div>
    <div class="status" id="gh-status"></div>
  </div>

  </div><!-- /tab-maintenance -->

  <footer><span id="gh-footer-status"></span> · 평일 09:00 KST 자동 갱신 · 마지막 갱신: ${formatDate(tasks.fetchedAt || gheUpdates.lastPoll)}</footer>
</div>

<script>
// === 탭 전환 ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// === GitHub PAT 설정 ===
const GH_REPO = 'TOAST-DOCS/TW';
const RESOLVED_PATH = 'data/resolved.json';

(function initGhSetup() {
  const pat = localStorage.getItem('gh-pat');
  const setupEl = document.getElementById('gh-setup');
  const footerStatus = document.getElementById('gh-footer-status');
  if (pat) {
    setupEl.style.display = 'none';
    if (footerStatus) footerStatus.innerHTML = '<span style="color:var(--success);">GitHub 연결됨</span> \u00b7 <a href="#" id="gh-disconnect" style="color:var(--text-muted);font-size:13px;">연결 해제</a>';
    document.getElementById('gh-disconnect').addEventListener('click', function(e) { e.preventDefault(); localStorage.removeItem('gh-pat'); location.reload(); });
  } else {
    setupEl.style.display = 'block';
    if (footerStatus) footerStatus.innerHTML = '<span style="color:var(--text-muted);">GitHub 미연결</span>';
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
      resolution: 'no-change',
      reason: '대시보드에서 확인 완료 (수정 불필요)',
      resolvedBy: '대시보드',
      resolvedAt: new Date().toISOString()
    });

    // 4. 커밋
    const putRes = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + RESOLVED_PATH, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'chore: 변경 관리 확인 완료 - ' + guide.split('/').pop(),
        content: btoa(unescape(encodeURIComponent(JSON.stringify(resolved, null, 2)))),
        sha: sha
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      if (putRes.status === 409) {
        throw new Error('다른 팀원이 동시에 수정했습니다. 새로고침 후 다시 시도해 주세요.');
      }
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

// === 페이지 로드 시 resolved 상태 동기화 ===
(async function syncResolved() {
  const pat = localStorage.getItem('gh-pat');
  if (!pat) return;

  try {
    const headers = { Authorization: 'token ' + pat, Accept: 'application/vnd.github+json' };
    const res = await fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + RESOLVED_PATH, { headers });
    if (!res.ok) return;

    const data = await res.json();
    const resolved = JSON.parse(atob(data.content));
    const resolvedKeys = new Set((resolved.resolved || []).map(r => r.updateId + '::' + (r.guide || '')));
    if (resolvedKeys.size === 0) return;

    // 1. 체크박스 복원
    document.querySelectorAll('.guide-check input[type="checkbox"]').forEach(cb => {
      const key = cb.dataset.updateId + '::' + cb.dataset.guide;
      if (resolvedKeys.has(key) && !cb.checked) {
        cb.checked = true;
        cb.disabled = true;
        const label = cb.nextElementSibling;
        if (label) label.classList.add('checked');
      }
    });

    // 2. 모든 가이드가 resolved된 카드 숨김
    document.querySelectorAll('.maint-card').forEach(card => {
      const checks = card.querySelectorAll('input[type="checkbox"]');
      if (checks.length > 0 && [...checks].every(c => c.checked)) {
        card.classList.add('all-checked');
      }
    });

    // 3. 카운트 재계산
    const visibleCards = document.querySelectorAll('.maint-card:not(.all-checked)').length;
    // 요약 바 카운트
    document.querySelectorAll('.gs-value').forEach(el => {
      if (el.closest('.gs-item') && el.closest('.gs-item').textContent.includes('변경 관리')) {
        el.textContent = visibleCards;
        el.className = 'gs-value ' + (visibleCards > 0 ? 'danger' : 'success');
      }
    });
    // 탭 배지
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === 'maintenance') {
        const badge = btn.querySelector('.tab-badge');
        if (visibleCards > 0) {
          if (badge) { badge.textContent = visibleCards; }
          else { btn.insertAdjacentHTML('beforeend', ' <span class="tab-badge">' + visibleCards + '</span>'); }
        } else {
          if (badge) badge.remove();
        }
      }
    });
    // 빈 상태 표시
    if (visibleCards === 0 && !document.querySelector('#tab-maintenance .empty-state')) {
      const section = document.querySelector('#tab-maintenance .maint-section');
      if (section) section.insertAdjacentHTML('beforebegin', '<div class="empty-state"><div class="icon">&#10003;</div><p>변경 관리가 필요한 항목이 없습니다.</p></div>');
    }
  } catch (e) {
    // 동기화 실패는 무시 — 다음 로드 시 재시도
  }
})();

// === 완료 열 연도별 접기/펼치기 ===
document.querySelectorAll('.year-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    const cards = btn.nextElementSibling;
    cards.style.display = cards.style.display === 'none' ? 'block' : 'none';
  });
});

// === 칸반 10행 접기/펼치기 ===
const MAX_VISIBLE = 10;
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

// === 드롭다운 필터 ===
let activeAssignee = 'all';
let activeMilestone = 'all';
let activeType = 'all';

function applyFilters() {
  document.querySelectorAll('.kanban-card').forEach(card => {
    const matchAssignee = activeAssignee === 'all' || (card.dataset.assignees || '').includes(activeAssignee);
    const ms = card.dataset.milestone || '';
    const matchMilestone = activeMilestone === 'all' || ms === activeMilestone;
    const matchType = activeType === 'all' || (card.dataset.type || '') === activeType;
    card.classList.toggle('hidden', !(matchAssignee && matchMilestone && matchType));
  });

  document.querySelectorAll('.maint-card').forEach(card => {
    if (activeAssignee === 'all') {
      card.classList.remove('hidden');
    } else {
      card.classList.toggle('hidden', !(card.dataset.assignees || '').includes(activeAssignee));
    }
  });

  document.querySelectorAll('.kanban-col').forEach(col => {
    const visible = col.querySelectorAll('.kanban-card:not(.hidden)').length;
    const countEl = col.querySelector('.count');
    if (countEl) countEl.textContent = visible;
  });
}

function setupDropdown(toggleId, menuId, onSelect) {
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    // 다른 메뉴 닫기
    document.querySelectorAll('.filter-menu.open').forEach(m => { if (m !== menu) m.classList.remove('open'); });
    document.querySelectorAll('.filter-toggle.open').forEach(t => { if (t !== toggle) t.classList.remove('open'); });
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  menu.querySelectorAll('.filter-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      menu.querySelectorAll('.filter-menu-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      menu.classList.remove('open');
      toggle.classList.remove('open');
      const val = item.dataset.value;
      const label = val === 'all' ? toggle.dataset.defaultLabel : item.textContent.replace(/\\d+$/, '').trim();
      toggle.innerHTML = label + ' <span class="arrow">&#9662;</span>';
      toggle.classList.toggle('active', val !== 'all');
      onSelect(val);
    });
  });
}

const aToggle = document.getElementById('assignee-toggle');
if (aToggle) aToggle.dataset.defaultLabel = '작업자별 보기';
const mToggle = document.getElementById('milestone-toggle');
if (mToggle) mToggle.dataset.defaultLabel = '타깃 일정별 보기';

setupDropdown('assignee-toggle', 'assignee-menu', (val) => { activeAssignee = val; applyFilters(); });
setupDropdown('milestone-toggle', 'milestone-menu', (val) => { activeMilestone = val; applyFilters(); });
const tToggle = document.getElementById('type-toggle');
if (tToggle) tToggle.dataset.defaultLabel = '유형별 보기';
setupDropdown('type-toggle', 'type-menu', (val) => { activeType = val; applyFilters(); });

// 바깥 클릭 시 닫기
document.addEventListener('click', () => {
  document.querySelectorAll('.filter-menu.open').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.filter-toggle.open').forEach(t => t.classList.remove('open'));
});

// === 변경 관리 프롬프트 복사 — 가이드별 구조화된 프롬프트 생성 + 클립보드 복사 ===
function onStartUpdate(btn) {
  const source = btn.dataset.source === 'ghe' ? 'GHE 변경 감지' : '월별 배포 사항';
  const service = btn.dataset.service || '';
  const summary = btn.dataset.summary || '';
  const diffUrl = btn.dataset.diffUrl || '';
  const keywords = btn.dataset.keywords || '';
  const updateId = btn.dataset.updateId || '';
  const guide = btn.dataset.guide || '';
  const guideTitle = btn.dataset.guideTitle || '';
  const guideAssignee = btn.dataset.guideAssignee || '';
  const patchesRaw = btn.dataset.patches || '';

  const lines = [
    '"update-guide" SKILL.md 파일을 ~/.claude/skills/ 하위에서 찾아서 읽고, 그 절차대로 진행해줘.',
    '',
    '## 변경 출처',
    '- 유형: ' + source,
    '- 서비스: ' + service,
    '- 변경 요약: ' + summary,
  ];
  if (diffUrl) lines.push('- diff 링크: ' + diffUrl);
  if (keywords) lines.push('- 매칭 키워드: ' + keywords);

  // 관련 배포 사항
  const deployRaw = btn.dataset.deployContext || '';
  if (deployRaw) {
    try {
      const deployCtx = JSON.parse(deployRaw);
      if (deployCtx.length > 0) {
        const deployText = deployCtx.map(function(ctx) { return '[' + ctx.month + '] ' + ctx.changes; }).join(' / ');
        lines.push('- 관련 배포 사항: ' + deployText);
      }
    } catch (e) { /* 파싱 실패 시 생략 */ }
  }

  // diff 전문 포함
  if (patchesRaw) {
    try {
      const patches = JSON.parse(patchesRaw);
      const hasPatch = patches.some(function(p) { return p.patch; });
      if (hasPatch) {
        lines.push('', '## diff 전문');
        patches.forEach(function(p) {
          if (!p.patch) return;
          lines.push('', '### ' + p.filename, '\x60\x60\x60diff', p.patch, '\x60\x60\x60');
        });
      }
    } catch (e) { /* JSON 파싱 실패 시 diff 전문 생략 */ }
  }

  lines.push('', '## 대상 가이드');
  lines.push('- 제목: ' + guideTitle);
  lines.push('- 파일: ' + guide);
  lines.push('- 담당자: ' + guideAssignee);
  lines.push('', '## 대시보드 추적 ID');
  lines.push('- updateId: ' + updateId);
  lines.push('- guide: ' + guide);

  const prompt = lines.join('\\n');

  navigator.clipboard.writeText(prompt).then(() => {
    const orig = btn.textContent;
    btn.textContent = '복사됨';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-success');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); btn.classList.add('btn-primary'); }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = prompt;
    ta.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:400px;z-index:9999;font-size:13px;';
    document.body.appendChild(ta);
    ta.select();
    ta.addEventListener('blur', () => ta.remove());
  });
}
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
