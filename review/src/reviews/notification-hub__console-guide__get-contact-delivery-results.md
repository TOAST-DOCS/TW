---
service: notification-hub
path: ko/console-guide/get-contact-delivery-results.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/console-guide/get-contact-delivery-results.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 70행 `### 검색 결과 다운로드` 제목 직후 빈 줄 없음 → 제목 뒤 빈 줄 1개 추가(58행처럼)
- [x] [변경분] 56·68행 앵커 태그 2개 추가 — 링크 앵커로 적절, 조치 불필요
- [x] [변경분] 31행 `pre-align` 주석 추가 — 메타 주석, 조치 불필요
- [참고] 49·53·60·73행 등 불릿 기호 `*` 사용은 레포 전반 정착·MkDocs 정상 렌더 → 일괄 `-` 치환은 레포 정책 확인 후 판단(이번 diff 무관)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 6월 diff는 앵커 태그 2개·pre-align 주석 추가뿐으로 본문·용어·서식 변경 없음 → 변경분 G.
- 용어(Console/회원/IAM 멤버/그룹태그 등) 위반 없음, 외부 링크·콘솔 메뉴 단정 지적 없음. 전체 기준 실 이슈는 70행 빈 줄 누락 1건뿐.
