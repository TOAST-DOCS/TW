/**
 * resolved.json merge - poll이 갱신한 PR 상태를 origin 최신본에 반영
 *
 * checkPrStatuses()는 기존 항목의 prStatus/mergedAt만 in-place 수정.
 * origin 쪽에 팀원이 대시보드에서 추가한 체크 항목이 있을 수 있으므로,
 * origin을 기준으로 poll 변경분(PR 상태)만 머지한다.
 *
 * Usage: node src/merge-resolved.js <poll-resolved-path> <origin-resolved-path>
 * origin-resolved-path 파일을 in-place 업데이트
 */
const fs = require('fs');

const [pollPath, originPath] = process.argv.slice(2);
if (!pollPath || !originPath) {
  console.error('Usage: node src/merge-resolved.js <poll> <origin>');
  process.exit(1);
}

const poll = JSON.parse(fs.readFileSync(pollPath, 'utf8'));
const origin = JSON.parse(fs.readFileSync(originPath, 'utf8'));

const pollMap = new Map();
for (const item of poll.resolved || []) {
  pollMap.set(`${item.updateId}::${item.guide || ''}`, item);
}

let merged = 0;
for (const originItem of origin.resolved || []) {
  const key = `${originItem.updateId}::${originItem.guide || ''}`;
  const pollItem = pollMap.get(key);
  if (!pollItem) continue;

  if (pollItem.prStatus && pollItem.prStatus !== originItem.prStatus) {
    originItem.prStatus = pollItem.prStatus;
    merged++;
  }
  if (pollItem.mergedAt && !originItem.mergedAt) {
    originItem.mergedAt = pollItem.mergedAt;
    merged++;
  }
}

fs.writeFileSync(originPath, JSON.stringify(origin, null, 2) + '\n', 'utf8');
console.log(`Merged resolved.json: ${merged} field(s) updated, ${origin.resolved.length} total items`);
