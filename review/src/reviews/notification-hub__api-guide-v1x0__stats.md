---
service: notification-hub
path: ko/api-guide-v1x0/stats.md
status: M
grade_change: O
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/stats.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [변경분] 179행 `필드을`·`필드은` → `필드를`·`필드는` (`필드`는 받침 없음)
- [ ] [변경분] 97행 `그룹핑`(MINUTELY/HOURLY/DAILY/BY_DAY_OF_WEEK) → `그룹화` (같은 셀 `그룹화됩니다`와 불일치)
- [ ] [변경분] 98행 `그룹핑된` → `그룹화된` (97행과 용어 통일)
- [ ] [참고] 111행 `+09:00로`(기존 `으로`에서 변경) → 시각 표기 뒤 조사, 작성자 확인

## 참고
- 등급: ⓐ 변경분 = 수정 필요(O) / ⓑ 문서 전체 = 수정 필요(O)
- 6월 diff 본문 3건 모두 변경분 신규 이슈. R 근거(기술 오류·링크 깨짐·필수 섹션 누락·콘솔 UI 불일치) 없음.
- 표 정렬·코드 블록·필수 섹션(요청/파라미터/본문/응답/예시) 정상, 기존 이슈 미발견 → ⓑ는 변경분 이슈만 반영.
