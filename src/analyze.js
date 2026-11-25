const fs = require('fs');
const path = require('path');
const config = require('./config');

const GUIDE_DIR = path.resolve(__dirname, '..', 'task-guide', 'ko');

/**
 * task-guide/ko/ 의 모든 가이드 파일을 읽어서 { filename, content } 배열 반환
 */
function loadGuides() {
  if (!fs.existsSync(GUIDE_DIR)) return [];
  return fs.readdirSync(GUIDE_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      filename: `task-guide/ko/${f}`,
      content: fs.readFileSync(path.join(GUIDE_DIR, f), 'utf-8'),
    }));
}

/**
 * 한국어 서술 어미·활용형 패턴 (정규식)
 * - 종결 어미: ~합니다, ~됩니다, ~입니다, ~세요, ~으며, ~는데 등
 * - 연결 어미: ~하고, ~해서, ~하여, ~으로, ~부터 등
 * - 관형형: ~하는, ~되는, ~있는, ~설정한, ~설정할 등
 * - 선어말+종결 복합: ~하겠습니다, ~되었습니다 등
 */
const VERB_SUFFIX_RE = new RegExp(
  '(' +
  // 종결 어미 (존칭·평서·의문·청유)
  '하세요|하십시오|하시기|하시는|하셔야|하겠습니다|되겠습니다|' +
  '합니다|됩니다|입니다|습니다|합니까|습니까|ㅂ니다|냅니다|옵니다|봅니다|줍니다|갑니다|납니다|' +
  '하세요|주세요|보세요|하시오|바랍니다|' +
  // 연결 어미
  '하고|해서|하여|하며|하면|하도록|하기|하게|' +
  '되고|되어|되며|되면|되도록|되기|되게|해야|해도|해서|해주|' +
  '으며|이며|으면|이면|으로|으로서|으로써|' +
  '에서|부터|까지|에게|한테|' +
  // 관형형·활용형 접미
  '하는|되는|있는|없는|했던|됐던|' +
  '한다|된다|한다면|된다면|' +
  '하여야|되어야|하였|되었|했을|됐을|' +
  '할|된|한|될|해|하|' +
  // 보조 용언
  '있어야|없으면|있으면' +
  ')$'
);

/**
 * 한국어 조사 패턴 (정규식, 단일 문자 조사)
 */
const JOSA_RE = /[은는이가을를의에로와과도만서]$/;

/**
 * 한국어 토큰에서 어미·조사를 제거하여 어간 추출
 * - 어미 제거 후 어간이 1글자 → null 반환 (서술형 토큰으로 간주, 키워드 부적합)
 * - 어미 매칭 없이 2글자 이상 → 원본 반환
 */
function stemKorean(token) {
  let s = token;
  const beforeVerb = s;
  // 1) 복합 서술 어미 먼저 제거
  s = s.replace(VERB_SUFFIX_RE, '');
  const verbMatched = (s !== beforeVerb);
  // 2) 단일 문자 조사 제거
  if (s.length >= 3) s = s.replace(JOSA_RE, '');
  // 어미가 매칭됐는데 어간이 1글자면 서술형 토큰 → 제외
  if (verbMatched && s.length < 2) return null;
  return s.length >= 2 ? s : token;
}

/**
 * guide-mapping.json의 서비스명·리포명에서 불용어 셋 생성
 * — 리포 매핑으로 이미 스코핑되므로 키워드 매칭에서는 노이즈
 */
function buildServiceStopwords(mappings) {
  const set = new Set();
  for (const m of mappings) {
    // 서비스명: "Cloud Monitoring" → "cloud", "monitoring"
    if (m.service) {
      for (const part of m.service.split(/[\s-]+/)) {
        if (part.length >= 2) set.add(part.toLowerCase());
      }
    }
    // 리포명: "Monitoring-Cloud-Monitoring" → "monitoring", "cloud"
    for (const repo of m.repos || []) {
      for (const part of repo.split(/[-_]+/)) {
        if (part.length >= 2) set.add(part.toLowerCase());
      }
    }
  }
  return set;
}

// 정적 불용어 (extractKeywords에서 사용)
const STOPWORDS = new Set([
  // ── 한글: 조사·어미·접속 ──
  '수', '것', '등', '및', '또는', '이', '가', '을', '를', '의', '에', '에서',
  '으로', '로', '합니다', '됩니다', '있습니다', '없습니다', '입니다',
  '하는', '되는', '있는', '없는', '위해', '통해', '대한', '따라',
  // ── 한글: UI·문서 공통 동작 ──
  '경우', '설정', '사용', '추가', '변경', '삭제', '확인', '참고',
  '아래', '위', '다음', '이전', '해당', '관련', '필요', '가능',
  '생성', '선택', '입력', '클릭', '버튼', '화면', '페이지', '목록',
  '서비스', '프로젝트', '리소스', '콘솔', '메뉴',
  '정보', '이름', '상태', '결과', '요청', '사용자', '제공',
  '기능', '방법', '절차', '과정', '내용', '항목', '유형', '지원', '제한',
  // ── 한글: 범용 명사 (거의 모든 가이드에 등장) ──
  '업로드', '다운로드', '이미지', '메시지', '파일', '파일의', '데이터',
  '오류', '에러', '응답', '전송', '수신', '호출', '실행', '처리', '완료',
  '활성화', '비활성화', '등록', '해제', '연동', '연결', '적용', '저장',
  '조회', '검색', '표시', '노출', '동작', '작업', '구성', '관리',
  '유효성', '인증', '권한', '정책', '규칙', '조건', '값',
  '테스트', '배포', '운영', '개발', '환경', '서버', '클라이언트',
  '도메인', '네트워크', '인스턴스', '포트', '경로', '주소',
  '시간', '기간', '날짜', '최대', '최소', '기본', '전체', '일부',
  // ── 한글: 범용 2글자어 ──
  '또한', '그리고', '하지만', '따라서', '만약', '혹은',
  '문서', '가이드', '예시', '예를', '참조', '안내', '소개', '개요',
  '지정', '수정', '반영', '이동', '복사', '붙여', '열기', '닫기',
  '보기', '펼치', '접기', '누르', '눌러', '선택',
  '상단', '하단', '좌측', '우측', '왼쪽', '오른',
  '탭', '창', '팝업', '모달', '영역', '섹션', '형식', '구조',
  '이후', '이전', '현재', '새로', '기존', '별도', '동일', '각각',
  '필요한', '가능한', '있어야', '없으면', '있으면', '사용할', '생성할', '설정할',
  '있어', '없어', '모두', '하나', '같은', '다른', '여러', '함께',
  '사용될', '설정된', '사용된', '포함된', '지정된', '선택할', '확인할',
  '통과해야', '성공', '실패', '완료',
  // ── 한글: 범용 클라우드·인프라 용어 (서비스 불문 등장) ──
  '인프라', '클라우드', '준비', '구분', '중지', '참고하세요',
  '권장', '있으며', '코드', '방식', '저장할', '한국', '세션', '유지',
  '설정한', '설정하', '단위', '타임아웃', '자동', '수동', '타입',
  '게임', '보안', '리전', '가용', '복제', '백업', '복원', '모니터링',
  '알림', '로그', '지표', '대시보드', '토글', '여부',
  '시작', '종료', '재시작', '초기화', '업데이트', '마이그레이션',
  '계정', '토큰', '키', '비밀번호', '암호화', '복호화',
  '요금', '과금', '무료', '유료', '플랜', '요금제',
  '트래픽', '대역폭', '용량', '스펙', '사양',
  // ── 영문: 범용 프로그래밍·인프라 ──
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can',
  'was', 'one', 'our', 'has', 'with', 'this', 'that', 'from',
  'true', 'false', 'null', 'undefined', 'string', 'number', 'type',
  'name', 'value', 'list', 'get', 'set', 'put', 'post', 'delete',
  'env', 'var', 'config', 'default', 'error', 'code', 'etc',
  'request', 'response', 'status', 'header', 'body', 'query', 'param',
  'url', 'uri', 'path', 'port', 'host',
  'md', 'ko', 'en', 'api', 'http', 'https', 'json', 'html', 'xml', 'yaml',
  'sdk', 'cli', 'gui', 'web', 'app',
  // ── 영문: NHN Cloud 플랫폼 공통 (서비스명은 동적 생성) ──
  'nhn', 'nhncloud', 'cloud', 'toast', 'console', 'region',
  'security', 'network', 'compute', 'storage', 'instance',
  'monitoring', 'gateway', 'balancer', 'firewall',
]);

/**
 * patch 텍스트에서 추가된 줄(+)의 주요 키워드를 추출
 * - 한글 2글자 이상 단어, 영문 3글자 이상 단어
 * - 마크다운 문법, 숫자만인 토큰, 서술 어미 제외
 * - 정적 불용어 + 동적 서비스명 불용어 제외
 */
function extractKeywords(patch, dynamicStopwords) {
  if (!patch) return [];

  // 추가된 줄만 추출
  const addedLines = patch
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.substring(1))
    .join(' ');

  // 마크다운/HTML 태그 제거
  const cleaned = addedLines
    .replace(/<[^>]+>/g, '')
    .replace(/[#*`\[\](){}|>_~]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ');

  // 토큰 분리
  const tokens = cleaned.split(/[\s,;:./\\]+/).filter(Boolean);

  const keywords = new Set();
  for (const token of tokens) {
    const t = token.trim();
    // 숫자만인 토큰 제외
    if (/^\d+$/.test(t)) continue;
    // 숫자+단위 조합 제외 (100ms, 3개, 5GB 등)
    if (/^\d+[a-zA-Z가-힣]+$/.test(t)) continue;

    // 한글 처리
    if (/[가-힣]/.test(t)) {
      const stemmed = stemKorean(t);
      if (!stemmed || stemmed.length < 2) continue;
      if (STOPWORDS.has(t) || STOPWORDS.has(stemmed)) continue;
      if (dynamicStopwords && dynamicStopwords.has(stemmed)) continue;
      keywords.add(stemmed);
    }
    // 영문 처리: 3글자 이상
    if (/^[a-zA-Z]/.test(t) && t.length >= 3) {
      const lower = t.toLowerCase();
      if (STOPWORDS.has(lower)) continue;
      if (dynamicStopwords && dynamicStopwords.has(lower)) continue;
      keywords.add(t);
    }
  }

  return [...keywords];
}

/**
 * 키워드가 가이드 본문에서 발견되는 위치를 찾기
 * 매칭된 키워드와 해당 행 번호를 반환
 */
function findKeywordMatches(keywords, guideContent) {
  const lines = guideContent.split('\n');
  const matches = [];

  for (const keyword of keywords) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(keyword)) {
        matches.push({
          keyword,
          line: i + 1,
          context: lines[i].trim().substring(0, 80),
        });
        break; // 키워드당 첫 번째 매칭만
      }
    }
  }

  return matches;
}

/**
 * GHE 변경 건에 대해 가이드별 키워드 매칭 분석 수행
 * - 서비스명/카테고리명은 동적 불용어로 제외 (리포 매핑으로 이미 스코핑)
 * - 매칭 임계값: 5건 이상이어야 "확인 필요"로 판정
 */
const MIN_MATCH_THRESHOLD = 5;

function analyzeChange(change, guides, mappings) {
  // 0. 서비스명·리포명에서 동적 불용어 생성
  const dynamicStopwords = buildServiceStopwords(mappings);

  // 1. 모든 patch에서 키워드 추출 (동적 불용어 전달)
  const allKeywords = [];
  for (const file of change.files || []) {
    const kw = extractKeywords(file.patch, dynamicStopwords);
    allKeywords.push(...kw);
  }
  // 중복 제거, 최대 50개
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 50);

  if (uniqueKeywords.length === 0) return [];

  // 2. 변경된 리포에 매핑된 가이드만 대상 (서비스 단위 스코핑)
  const mappedEntries = mappings.filter((m) => m.repos.includes(change.repo));
  const mappedGuideFiles = new Set(mappedEntries.map((m) => m.guide));

  if (mappedGuideFiles.size === 0) return [];

  const results = [];

  for (const guide of guides) {
    if (!mappedGuideFiles.has(guide.filename)) continue;
    const matches = findKeywordMatches(uniqueKeywords, guide.content);
    if (matches.length < MIN_MATCH_THRESHOLD) continue;

    const mapping = mappedEntries.find((m) => m.guide === guide.filename);

    results.push({
      guide: guide.filename,
      title: mapping ? mapping.title : guide.filename,
      assignee: mapping ? mapping.assignee : '미지정',
      matchCount: matches.length,
      matches: matches.slice(0, 5),
    });
  }

  // 매칭 수 내림차순
  results.sort((a, b) => b.matchCount - a.matchCount);

  return results;
}

/**
 * 분석 결과를 사람이 읽기 좋은 안내 문구로 변환
 */
function formatAnalysisMessage(change, analysisResults) {
  if (analysisResults.length === 0) return null;

  const lines = [
    `[${change.repo}] 리포지터리에서 ko/ 디렉터리 내 ${change.mdChanges}개 파일이 변경되었습니다.`,
    '',
  ];

  for (const result of analysisResults) {
    const kwList = result.matches.map((m) => m.keyword).join(', ');
    lines.push(
      `• ${result.title}`,
      `  변경 diff에서 [${kwList}] 등의 키워드가 확인되었으며,`,
      `  해당 가이드에서도 동일 키워드를 포함하고 있어 변경 필요 여부를 확인해 주세요.`,
      `  (담당: ${result.assignee})`,
      '',
    );
  }

  return lines.join('\n');
}

/**
 * 일반 텍스트에서 주요 키워드를 추출 (배포 사항 등 patch가 아닌 텍스트용)
 */
function extractKeywordsFromText(text, dynamicStopwords) {
  if (!text) return [];
  const pseudoPatch = text
    .split('\n')
    .map((line) => '+' + line)
    .join('\n');
  return extractKeywords(pseudoPatch, dynamicStopwords);
}

module.exports = {
  loadGuides,
  extractKeywords,
  extractKeywordsFromText,
  findKeywordMatches,
  analyzeChange,
  formatAnalysisMessage,
  buildServiceStopwords,
};
