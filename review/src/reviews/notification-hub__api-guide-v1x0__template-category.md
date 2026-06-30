---
service: notification-hub
path: ko/api-guide-v1x0/template-category.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/template-category.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 577행 응답 필드 설명 `No description`(자동 생성 잔여물) → 한글 설명(예: `카테고리 아이디`)으로 교체
- [ ] [기존] 565행 응답 예시 값 `"String - Default and Example is not provided."`(자동 생성 잔여물) → 실제 예시 값(예: `"A9z0A9z0"`)으로 교체
- [x] [변경분] 6월 diff는 6개 섹션에 HTML 앵커(`<a id="...">`)와 `pre-align` 주석 추가뿐 — 한글 본문·용어·표·코드 변경 없음, 조치 불필요

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 앵커 ID·`pre-align` 주석만 추가한 구조적 변경이라 변경분은 깨끗(G).
- 전체 스캔 결과 `Console`·`회원`·`IAM 멤버`·`그룹태그`·UI 경로 등 글로서리 위반 없음, 표·코드블록 정상, 깨진 링크 없음. 자동 생성 잔여 플레이스홀더 2건(565·577행)만 기존 이슈로 남아 ⓑ는 O.
- 콘솔 메뉴·경로 실측이 필요한 지적은 없음.
