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
    // 한글 불용어 (범용 단어 포함)
    '수', '것', '등', '및', '또는', '이', '가', '을', '를', '의', '에', '에서',
    '으로', '로', '합니다', '됩니다', '있습니다', '없습니다', '입니다',
    '하는', '되는', '있는', '없는', '위해', '통해', '대한', '따라',
    '경우', '설정', '사용', '추가', '변경', '삭제', '확인', '참고',
    '아래', '위', '다음', '이전', '해당', '관련', '필요', '가능',
    '생성', '선택', '입력', '클릭', '버튼', '화면', '페이지', '목록',
    '서비스', '프로젝트', '리소스', '콘솔', '메뉴',
    '정보', '이름', '상태', '결과', '요청',
    '기능', '방법', '절차', '과정', '내용', '항목', '유형',
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
    // 한글: 3글자 이상
    if (/[가-힣]/.test(t) && t.length >= 3 && !stopwords.has(t)) {
      keywords.add(t);
    }
    // 영문: 4글자 이상 (API명, 파라미터명 등)
    if (/^[a-zA-Z]/.test(t) && t.length >= 4 && !stopwords.has(t.toLowerCase())) {
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

  // 2. 리포 매핑된 가이드는 2개 이상, 비매핑 가이드는 3개 이상 매칭 필요
  const mappedGuideFiles = new Set(
    mappings.filter((m) => m.repos.includes(change.repo)).map((m) => m.guide)
  );

  const results = [];

  for (const guide of guides) {
    const matches = findKeywordMatches(uniqueKeywords, guide.content);
    const isMapped = mappedGuideFiles.has(guide.filename);
    const threshold = isMapped ? 2 : 3;
    if (matches.length < threshold) continue;

    const mapping = mappings.find((m) => m.guide === guide.filename);

    results.push({
      guide: guide.filename,
      title: mapping ? mapping.title : guide.filename,
      assignee: mapping ? mapping.assignee : '미지정',
      matchCount: matches.length,
      isMapped,
      matches: matches.slice(0, 5),
    });
  }

  // 매핑된 가이드 먼저, 그 다음 매칭 수 내림차순
  results.sort((a, b) => (b.isMapped - a.isMapped) || (b.matchCount - a.matchCount));

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

module.exports = {
  loadGuides,
  extractKeywords,
  findKeywordMatches,
  analyzeChange,
  formatAnalysisMessage,
};
