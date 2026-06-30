---
service: notification-hub
path: ko/service-policy-and-precondition/rcs.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/service-policy-and-precondition/rcs.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 484행 `사용중인` → `사용 중인` (띄어쓰기)
- [ ] [기존] 474·475행 `글자수에 포함` → `글자 수에 포함` (띄어쓰기)
- [ ] [기존] 476행 `복사 가능여부` → `복사 가능 여부` (띄어쓰기)
- [x] [변경분] 490행 신규 안내문(`'통합 RCS 여부'가 'O'인...`) 표기·띄어쓰기 적절, 조치 불필요
- [x] [변경분] 표 신규 열 `통합 RCS 여부`(O/X) 추가 일관, 조치 불필요
- [x] [변경분] 섹션 앵커 `<a id="...">` 추가는 구조용, 조치 불필요
- [ ] [참고] 409~411행 `회원가입`/`회원 가입` 혼용 → RCS Biz Center(외부) UI 명칭이므로 보존
- [ ] [참고] 표 헤더 `상품`/`상품명`은 RCS 메시지 유형 명칭(서비스≠상품 룰 비적용)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff(앵커 추가, `통합 RCS 여부` 열 신규, 안내문 1줄)는 모두 적절하여 변경분은 깨끗함(G). 문서 전체로는 기존 띄어쓰기 오류(사용중/글자수/가능여부) 3건이 남아 ⓑ는 O.
- 외부 링크는 모두 `https://`(rcsbizcenter.com)로 스킴상 깨짐 룰 비해당이며 diff에서 변경 없음.
- 콘솔 경로(`Notification Hub > 발신 정보 > 브랜드 관리` 등)는 diff에서 변경 없어 실측 지적 없음.
