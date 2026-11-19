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
 * patch 텍스트에서 추가된 줄(+)의 주요 키워드를 추출
 * - 한글 2글자 이상 단어, 영문 3글자 이상 단어
 * - 마크다운 문법, 숫자만인 토큰 제외
 * - 불용어 제외
 */
function extractKeywords(patch) {
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

  // 불용어
  const stopwords = new Set([
    // 한글 불용어 — 조사·어미·접속
    '수', '것', '등', '및', '또는', '이', '가', '을', '를', '의', '에', '에서',
    '으로', '로', '합니다', '됩니다', '있습니다', '없습니다', '입니다',
    '하는', '되는', '있는', '없는', '위해', '통해', '대한', '따라',
    // 한글 불용어 — UI·문서 공통 동작
    '경우', '설정', '사용', '추가', '변경', '삭제', '확인', '참고',
    '아래', '위', '다음', '이전', '해당', '관련', '필요', '가능',
    '생성', '선택', '입력', '클릭', '버튼', '화면', '페이지', '목록',
    '서비스', '프로젝트', '리소스', '콘솔', '메뉴',
    '정보', '이름', '상태', '결과', '요청', '사용자', '제공',
    '기능', '방법', '절차', '과정', '내용', '항목', '유형', '지원', '제한',
    // 한글 불용어 — 범용 명사 (대부분의 가이드에 등장하여 오탐 유발)
    '업로드', '다운로드', '이미지', '메시지', '파일', '파일의', '데이터',
    '오류', '에러', '응답', '전송', '수신', '호출', '실행', '처리', '완료',
    '활성화', '비활성화', '등록', '해제', '연동', '연결', '적용', '저장',
    '조회', '검색', '표시', '노출', '동작', '작업', '구성', '관리',
    '유효성', '인증', '권한', '정책', '규칙', '조건', '값',
    '테스트', '배포', '운영', '개발', '환경', '서버', '클라이언트',
    '도메인', '네트워크', '인스턴스', '포트', '경로', '주소',
    '시간', '기간', '날짜', '최대', '최소', '기본', '전체', '일부',
    // 한글 불용어 — 2글자 범용어 (글자수 조건 완화에 따른 잡음 방지)
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
    // 영문 불용어
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can',
    'was', 'one', 'our', 'has', 'with', 'this', 'that', 'from',
    'true', 'false', 'null', 'undefined', 'string', 'number',
    'md', 'ko', 'en', 'api', 'http', 'https', 'json', 'html',
  ]);

  const keywords = new Set();
  for (const token of tokens) {
    const t = token.trim();
    // 숫자만인 토큰 제외
    if (/^\d+$/.test(t)) continue;
    // 한글: 2글자 이상 (조사·어미 제거 후 불용어 체크)
    const stripped = t
      .replace(/[은는이가을를의에로와과도만]$/, '')
      .replace(/(합니다|합니다|됩니다|입니다|합니까|습니다|에서|하고|해서|으로|부터)$/, '');
    const checkWord = stripped.length >= 2 ? stripped : t;
    if (/[가-힣]/.test(t) && checkWord.length >= 2 && !stopwords.has(t) && !stopwords.has(stripped) && !stopwords.has(checkWord)) {
      keywords.add(checkWord);
    }
    // 영문: 3글자 이상 (서비스명 SMS, Hub 등 포함)
    if (/^[a-zA-Z]/.test(t) && t.length >= 3 && !stopwords.has(t.toLowerCase())) {
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
 */
function analyzeChange(change, guides, mappings) {
  // 1. 모든 patch에서 키워드 추출
  const allKeywords = [];
  for (const file of change.files || []) {
    const kw = extractKeywords(file.patch);
    allKeywords.push(...kw);
  }
  // 중복 제거, 최대 50개
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 50);

  if (uniqueKeywords.length === 0) return [];

  // 2. 변경된 리포에 매핑된 가이드만 대상 (서비스 단위 스코핑)
  //    - guide-mapping.json의 repos 배열에 해당 리포가 포함된 가이드만 후보
  //    - 한 가이드가 여러 서비스 리포를 가지면 양쪽 변경 시 모두 확인 대상
  const mappedEntries = mappings.filter((m) => m.repos.includes(change.repo));
  const mappedGuideFiles = new Set(mappedEntries.map((m) => m.guide));

  if (mappedGuideFiles.size === 0) return [];

  const results = [];

  for (const guide of guides) {
    if (!mappedGuideFiles.has(guide.filename)) continue; // 매핑된 가이드만 검사
    const matches = findKeywordMatches(uniqueKeywords, guide.content);
    if (matches.length < 3) continue;

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
function extractKeywordsFromText(text) {
  if (!text) return [];
  // '+' 접두사를 붙여 extractKeywords 로직을 재활용
  const pseudoPatch = text
    .split('\n')
    .map((line) => '+' + line)
    .join('\n');
  return extractKeywords(pseudoPatch);
}

module.exports = {
  loadGuides,
  extractKeywords,
  extractKeywordsFromText,
  findKeywordMatches,
  analyzeChange,
  formatAnalysisMessage,
};
