---
service: notification-hub
path: ko/api-guide-v1x0/flow.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/flow.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 76~79행 | 점 목록 불릿 기호 `*` | `-`로 통일
- [기존] | 77행 | `한번 사용된` (띄어쓰기) | `한 번 사용된`
- [기존] | 628·714행 | `## 플로우 삭제` 제목 중복 | 714행(do-delete 다중 삭제)을 `플로우 다중 삭제` 등으로 구분

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(서식·띄어쓰기 🟠, R 트리거 없음)
- 6월 diff는 앵커(`<a id>`) 추가와 `BRANDMESSAGE` 채널 enum 추가뿐. 채널 추가는 4개 표에 일관 반영, 기술적으로 적절(작성자 의도 변경 아님).
- 행번호는 본문(===CONTENT===) 기준으로 재산정함(1차 초안은 diff 포함 파일 줄번호를 사용해 +126 어긋나 있었음).
- 채널 enum 순서가 요청 본문(`SMS, RCS, ALIMTALK, ...`)과 응답 본문(알파벳순)에서 다르나 diff 이전부터의 표기이며 BRANDMESSAGE는 각 기존 순서에 맞춰 삽입됨 → 통일 지적 보류.
- 콘솔 경로·외부 http 링크·Console·회원·멤버·그룹태그 등 R/O 트리거 없음.
