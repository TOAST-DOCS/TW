const config = require('./config');

function headers() {
  return {
    Authorization: `dooray-api ${config.DOORAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Dooray API error: ${res.status} ${res.statusText} - ${url}`);
  }
  return res.json();
}

// 태그 ID → 이름 매핑 (단계, 유형만)
const TAG_MAP = {
  '4357594969515870142': { group: '단계', name: '01. 초안작성' },
  '4357595180684599295': { group: '단계', name: '02. 기술검토' },
  '4438580862223947989': { group: '단계', name: '03. 파트피어리뷰' },
  '4357596371083271196': { group: '단계', name: '04. 완료' },
  '4357594656749478727': { group: '유형', name: 'How-to' },
  '4357594795571692950': { group: '유형', name: 'Troubleshooting' },
};

const STAGE_LABELS = {
  '01. 초안작성': '초안작성',
  '02. 기술검토': '기술검토',
  '03. 파트피어리뷰': '파트피어리뷰',
  '04. 완료': '완료',
};

/**
 * 태그 ID 목록에서 특정 그룹의 태그 이름 추출
 */
function getTagValue(tagIds, group) {
  for (const t of tagIds || []) {
    const id = typeof t === 'object' ? t.id : t;
    const mapped = TAG_MAP[id];
    if (mapped && mapped.group === group) return mapped.name;
  }
  return null;
}

/**
 * 실전 가이드 프로젝트에서 How-to / Troubleshooting 태스크만 조회
 * 두레이 태그 기반으로 유형·단계를 읽어옴
 */
async function fetchGuideTasks() {
  const tasks = [];
  let page = 0;
  const size = 100;

  while (true) {
    const url = `${config.DOORAY_API}/project/v1/projects/${config.DOORAY_PROJECT_ID}/posts?size=${size}&page=${page}`;
    const data = await fetchJSON(url);
    const items = data.result || [];
    if (items.length === 0) break;

    for (const item of items) {
      const title = item.subject || '';
      const tagIds = item.tags || [];

      // 유형 태그로 필터 (태그 없으면 제목 접두사로 폴백)
      let type = getTagValue(tagIds, '유형');
      if (!type) {
        if (title.startsWith('[How-to]')) type = 'How-to';
        else if (title.startsWith('[Troubleshooting]')) type = 'Troubleshooting';
        else continue; // How-to/Troubleshooting 아니면 제외
      }

      // 단계 태그 읽기
      const stageTag = getTagValue(tagIds, '단계');
      const stage = stageTag ? (STAGE_LABELS[stageTag] || stageTag) : '초안작성';

      const assignees = (item.users?.to || []).map((u) => u.member?.name || '미지정');

      tasks.push({
        id: item.id,
        title,
        type,
        stage,
        status: item.workflowClass || 'registered',
        assignees: assignees.length > 0 ? assignees : ['미지정'],
        milestone: item.milestone ? { id: item.milestone.id, name: item.milestone.name } : null,
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : '',
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, 10) : '',
      });
    }

    if (items.length < size) break;
    page++;
  }

  return tasks;
}

/**
 * NHN Cloud 주요 배포 사항 — 하위 태스크(월별) 조회
 */
async function fetchDeployNotes() {
  const url = `${config.DOORAY_API}/project/v1/projects/${config.DOORAY_DEPLOY_PROJECT_ID}/posts?parentPostId=${config.DOORAY_DEPLOY_PARENT_TASK_ID}&size=20&page=0`;
  const data = await fetchJSON(url);
  const items = data.result || [];

  const months = [];
  for (const item of items) {
    const title = item.subject || '';
    // [2026.11] 형식에서 월 추출
    const monthMatch = title.match(/\[(\d{4})\.(\d{1,2})\]/);
    if (!monthMatch) continue;

    const month = `${monthMatch[1]}-${monthMatch[2].padStart(2, '0')}`;

    // 본문에서 서비스별 변경사항 파싱
    const bodyUrl = `${config.DOORAY_API}/project/v1/projects/${config.DOORAY_DEPLOY_PROJECT_ID}/posts/${item.id}`;
    let services = [];
    try {
      const detail = await fetchJSON(bodyUrl);
      const body = detail.result?.body?.content || '';
      services = parseDeployBody(body);
    } catch (err) {
      console.error(`  [WARN] Failed to parse deploy note ${item.id}: ${err.message}`);
    }

    months.push({
      month,
      taskId: item.id,
      title,
      services,
    });
  }

  // 최신순 정렬
  months.sort((a, b) => b.month.localeCompare(a.month));
  return months;
}

/**
 * 배포 사항 본문(HTML 테이블)에서 서비스명·변경 설명 파싱
 */
function parseDeployBody(html) {
  const services = [];
  // <td> 태그 기반 단순 파싱: 서비스명은 보통 두 번째 열
  // HTML 테이블: 구분 | 서비스&기능 | 설명 | 자세히 보기
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const cells = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(match[1])) !== null) {
      // Strip HTML tags and clean whitespace
      const text = cellMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
      cells.push(text);
    }

    if (cells.length < 2) continue;

    // 서비스명이 있는 셀 (빈 셀은 이전 rowspan 서비스에 속함)
    const serviceName = cells[0] || cells[1];
    const changes = cells.length >= 3 ? cells[cells.length - 2] : cells[1];

    // 릴리스 노트 링크 추출
    const linkMatch = match[1].match(/href="([^"]*release-notes[^"]*)"/);
    const releaseNoteUrl = linkMatch ? linkMatch[1] : '';

    if (serviceName && !serviceName.includes('구분') && !serviceName.includes('서비스')) {
      services.push({
        service: serviceName,
        changes: changes.substring(0, 200),
        releaseNoteUrl,
      });
    }
  }

  return services;
}

/**
 * 두레이 웹훅으로 현행화 알림 발송
 */
async function sendWebhook(message) {
  if (!config.DOORAY_WEBHOOK_URL) {
    console.log('  [SKIP] No webhook URL configured');
    return;
  }

  const res = await fetch(config.DOORAY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      botName: '실전 가이드 대시보드',
      text: message,
    }),
  });

  if (!res.ok) {
    console.error(`  [WARN] Webhook failed: ${res.status}`);
  }
}

module.exports = {
  fetchGuideTasks,
  fetchDeployNotes,
  parseDeployBody,
  sendWebhook,
};
