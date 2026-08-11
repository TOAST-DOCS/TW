---
service: notification-hub
path: ko/api-guide-v1x0/sender-unsubscribe.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/sender-unsubscribe.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 271행 | `default 50(최대 1000)` 천 단위 콤마 누락 | `default 50(최대 1,000)`

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 2차 검증: 6월 diff는 정렬 메타 주석 1건 + 영문 앵커 태그 3건뿐(용어·문장·구조 변경 없음) → ⓐ=G 유지.
- 유일한 실이슈는 271행 `1000` 천 단위 콤마 누락(서식, 🟠) → ⓑ=O 유지. status enum(`심사 중`·`사용 중`·`해지`)은 기술 표기로 보존. 외부 링크·콘솔 경로 주장 없음.
