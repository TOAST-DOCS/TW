---
service: Alimtalk
path: ko/webhook-api-guide.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# Alimtalk / ko/webhook-api-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [x] [변경분] 175행 `isAddedChannel` 표 행 추가 — 표 정의 일관·적절, 조치 불필요
- [x] [변경분] 194행 JSON 예시 `"isAddedChannel": "Boolean"` 추가 — 표와 일치, 조치 불필요
- [ ] [기존] 86행 `참고해 주세요` → `참고하세요`
- [ ] [기존] 86행 셀 내 별표 마커 `<br>*` → `-`

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 `isAddedChannel`(채널 추가 친구 여부) 필드 1건을 표·JSON 예시에 추가한 것이 전부이며, 나머지 diff 변경은 표 경계선 폭 재정렬(공백)뿐으로 내용 변화 없음. 변경분은 깨끗하여 ⓐ=G.
- 문서는 API 레퍼런스(203행)로, 줄별 문장비평 대신 용어/어미/조사/서식/링크/표·코드블록 구조를 체계 스캔함. 표의 `-`/`--`/`---` 접두는 API 응답 필드 계층 표기로 점 목록 위반 아님. EN/EM DASH·NBSP 특수문자 없음. 회원/멤버·콘솔 경로·외부 고객센터·정착 영문 서비스명(`KakaoTalk Bizmessage`) 관련 지적 없음. 기존 이슈는 어미(`참고해 주세요`)·셀 내 별표 마커 2건뿐이라 ⓑ=O.
