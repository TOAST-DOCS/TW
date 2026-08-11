---
service: notification-hub
path: ko/service-policy-and-precondition/push.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/service-policy-and-precondition/push.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 112~114행 | 불릿 기호 `*` | `-`
- [기존] | 180행 | 불릿 기호 `*` | `-`
- [기존] | 124행 | `Google Cloud와  A2A` 이중 공백 | 한 칸으로
- [기존] | 112행 | `Android 기기 ` 줄 끝 공백 | 제거
- [참고] | 118·143·183행 | 기존 `<span id>`와 신규 `<a id>` 앵커 중복 | 의도된 마이그레이션이면 유지, 정리 여부 작성자 판단
- [참고] | 139행 | 콘솔 경로 `Notification > Push > 인증서` | 콘솔 실측 권장(단정 불가)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 헤딩별 `<a id>` 앵커와 상단 `pre-align` 주석만 추가했고 prose·용어·구조 변경이 없어 변경분은 깨끗함(ⓐ=G). 문서 전체에는 `*` 불릿·이중/말미 공백 등 서식 이슈가 남아 있어 ⓑ=O. 기술 오류·끊긴 링크(전부 https)·필수 섹션 누락은 없음.
