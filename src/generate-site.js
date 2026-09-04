const fs = require('fs');
const path = require('path');
const config = require('./config');

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

function renderChangeCard(change) {
  return `
    <div class="change-card">
      <div class="change-header">
        <span class="arrow">&#9654;</span>
        <span class="repo-name">${esc(change.repo)}</span>
        <span class="md-count">${change.mdChanges} md file${change.mdChanges > 1 ? 's' : ''}</span>
      </div>
      <div class="change-body">
        <ul class="file-list">
          ${change.files.map((f) => `
            <li>
              <span class="file-status ${esc(f.status)}">${esc(f.status)}</span>
              <span>${esc(f.filename)}</span>
              <span class="file-diff">
                <span class="add">+${f.additions}</span>
                <span class="del">-${f.deletions}</span>
              </span>
            </li>
          `).join('')}
        </ul>
        <a href="${esc(change.compareUrl)}" target="_blank" rel="noopener" class="compare-link">
          GitHub에서 전체 diff 보기
        </a>
      </div>
    </div>`;
}

function renderChangesSection(changes) {
  if (!changes || changes.length === 0) {
    return `
      <div class="empty-state">
        <div class="icon">&#10003;</div>
        <p>최근 폴링에서 감지된 변경사항이 없습니다.</p>
      </div>`;
  }
  return `
    <div class="section-title">
      최근 변경 <span class="badge badge-count">${changes.length}</span>
    </div>
    ${changes.map(renderChangeCard).join('')}
  `;
}

function renderHistorySection(history) {
  if (!history || history.length === 0) {
    return `
      <div class="empty-state">
        <div class="icon">&#128214;</div>
        <p>폴링 이력이 아직 없습니다.</p>
      </div>`;
  }
  return history.map((batch) => `
    <div class="history-group">
      <div class="history-date">폴링: ${formatDate(batch.pollDate)}</div>
      ${batch.changes.map(renderChangeCard).join('')}
    </div>
  `).join('');
}

function renderReposSection(repoNames) {
  if (!repoNames || repoNames.length === 0) {
    return `
      <div class="empty-state">
        <div class="icon">&#128269;</div>
        <p>추적 중인 리포가 없습니다.</p>
      </div>`;
  }
  const sorted = [...repoNames].sort();
  return `
    <div class="section-title">
      추적 중인 리포 <span class="badge badge-count">${sorted.length}</span>
    </div>
    <div class="repo-list">
      ${sorted.map((r) => `
        <div class="repo-row">
          <a href="https://github.com/${config.ORG}/${r}/tree/${config.TARGET_BRANCH}/${config.TARGET_DIR}"
             target="_blank" rel="noopener">${esc(r)}</a>
        </div>
      `).join('')}
    </div>`;
}

function renderPage(results) {
  const hb = results.heartbeat;
  const changesHtml = renderChangesSection(results.changes);
  const historyHtml = renderHistorySection(results.history);
  const reposHtml = renderReposSection(hb ? hb.repoNames : []);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>사용자 가이드 업데이트 트래커</title>
<style>
:root {
  --bg: #f8f9fa; --card: #ffffff; --border: #dee2e6; --text: #212529;
  --text-muted: #6c757d; --primary: #0d6efd; --success: #198754;
  --added: #d4edda; --removed: #f8d7da; --modified: #fff3cd;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
.container { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
header { margin-bottom: 32px; }
header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
header p { color: var(--text-muted); font-size: 14px; }
.heartbeat { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.heartbeat-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--success); }
.heartbeat-info { flex: 1; }
.heartbeat-info .label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.heartbeat-info .value { font-size: 16px; font-weight: 600; }
.heartbeat-stats { display: flex; gap: 24px; }
.heartbeat-stat .label { font-size: 12px; color: var(--text-muted); }
.heartbeat-stat .value { font-size: 20px; font-weight: 700; }
.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 2px solid var(--border); }
.tab { padding: 8px 16px; border: none; background: none; font-size: 14px; cursor: pointer; color: var(--text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }
.section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.badge-count { background: var(--primary); color: white; }
.change-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
.change-header { padding: 16px 20px; display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none; }
.change-header:hover { background: var(--bg); }
.change-header .repo-name { font-weight: 600; font-size: 16px; flex: 1; }
.change-header .md-count { font-size: 13px; color: var(--text-muted); }
.change-header .arrow { color: var(--text-muted); transition: transform 0.2s; }
.change-header .arrow.open { transform: rotate(90deg); }
.change-body { display: none; border-top: 1px solid var(--border); padding: 16px 20px; }
.change-body.open { display: block; }
.file-list { list-style: none; }
.file-list li { padding: 6px 0; font-size: 14px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f0f0f0; }
.file-list li:last-child { border-bottom: none; }
.file-status { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; min-width: 56px; text-align: center; }
.file-status.added { background: var(--added); color: #155724; }
.file-status.removed { background: var(--removed); color: #721c24; }
.file-status.modified { background: var(--modified); color: #856404; }
.file-status.renamed { background: #cce5ff; color: #004085; }
.file-diff { color: var(--text-muted); font-size: 12px; margin-left: auto; white-space: nowrap; }
.file-diff .add { color: var(--success); }
.file-diff .del { color: #dc3545; }
.compare-link { display: inline-block; margin-top: 12px; padding: 6px 14px; background: var(--primary); color: white; text-decoration: none; border-radius: 6px; font-size: 13px; }
.compare-link:hover { background: #0b5ed7; }
.empty-state { text-align: center; padding: 48px 20px; color: var(--text-muted); }
.empty-state .icon { font-size: 48px; margin-bottom: 12px; }
.history-group { margin-bottom: 32px; }
.history-date { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid var(--border); }
.repo-list { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; }
.repo-row { padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.repo-row:last-child { border-bottom: none; }
.repo-row a { color: var(--primary); text-decoration: none; }
footer { margin-top: 32px; text-align: center; font-size: 12px; color: var(--text-muted); }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>사용자 가이드 업데이트 트래커</h1>
    <p>${esc(config.ORG)} / ${esc(config.TARGET_BRANCH)} branch / ${esc(config.TARGET_DIR)}/ directory</p>
  </header>

  <div class="heartbeat">
    <div class="heartbeat-dot"></div>
    <div class="heartbeat-info">
      <div class="label">Last Poll</div>
      <div class="value">${hb ? formatDate(hb.timestamp) : 'Not yet polled'}</div>
    </div>
    <div class="heartbeat-stats">
      <div class="heartbeat-stat">
        <div class="label">Tracked Repos</div>
        <div class="value">${hb ? hb.trackedRepos : '--'}</div>
      </div>
      <div class="heartbeat-stat">
        <div class="label">Changes</div>
        <div class="value">${(results.changes || []).length}</div>
      </div>
    </div>
  </div>

  <div class="tabs">
    <button class="tab active" data-tab="current">Current</button>
    <button class="tab" data-tab="history">History</button>
    <button class="tab" data-tab="repos">Tracked Repos</button>
  </div>

  <div id="current" class="tab-panel active">${changesHtml}</div>
  <div id="history" class="tab-panel">${historyHtml}</div>
  <div id="repos" class="tab-panel">${reposHtml}</div>

  <footer>격주(2/4주차 화요일) 배포 다음날 자동 갱신 · 마지막 생성: ${formatDate(new Date().toISOString())}</footer>
</div>

<script>
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
document.querySelectorAll('.change-header').forEach((header) => {
  header.addEventListener('click', () => {
    header.querySelector('.arrow').classList.toggle('open');
    header.nextElementSibling.classList.toggle('open');
  });
});
</script>
</body>
</html>
`;
}

function generateSite(results) {
  const outPath = path.resolve(__dirname, '..', config.SITE_FILE);
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, renderPage(results), 'utf-8');
  return outPath;
}

module.exports = { generateSite };
