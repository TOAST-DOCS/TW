---
service: notification-hub
path: ko/console-guide/statistics.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/console-guide/statistics.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 75~83·108~111행 점 목록 기호 `*` → `-`로 통일
- [ ] [기존] 109행 `해당 됩니다` → `해당됩니다`(붙여 쓰기)
- [x] [변경분] 95행 `브랜드 메시지` 통계 이벤트 행 추가 — 기존 채널 표기와 일관, 조치 불필요
- [x] [변경분] `<a id="...">` 앵커 및 `pre-align` 주석 추가 — 구조 정비, 조치 불필요

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 앵커 태그, pre-align 주석, `브랜드 메시지` 표 행 추가로 모두 적절(변경분 G).
- ⓑ는 점 목록 `*`(75~83·108~111행, 룰셋 `*`/`+`→`-` 위반)과 109행 `해당 됩니다` 붙여쓰기 오류로 O.
- 콘솔 메뉴/경로 실측 지적·외부 링크 근거 항목 없음.
