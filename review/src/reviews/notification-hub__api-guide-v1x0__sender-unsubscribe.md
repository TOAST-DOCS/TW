---
service: notification-hub
path: ko/api-guide-v1x0/sender-unsubscribe.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/sender-unsubscribe.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 271행 `default 50(최대 1000)` 천 단위 콤마 누락 → `default 50(최대 1,000)`
- [x] [변경분] 7행 `<!-- pre-align:aligned -->` 빌드 정렬 메타 주석 추가 → 콘텐츠 영향 없음
- [x] [변경분] 163·249·360행 `<a id="...">` 앵커 태그 추가 → 교차 링크용, 본문 변경 없음

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 2차 검증: 6월 diff는 정렬 메타 주석 1건 + 영문 앵커 태그 3건뿐(용어·문장·구조 변경 없음) → ⓐ=G 유지.
- 유일한 실이슈는 271행 `1000` 천 단위 콤마 누락(서식, 🟠) → ⓑ=O 유지. status enum(`심사 중`·`사용 중`·`해지`)은 기술 표기로 보존. 외부 링크·콘솔 경로 주장 없음.
