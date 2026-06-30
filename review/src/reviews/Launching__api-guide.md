---
service: Launching
path: ko/api-guide.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# Launching / ko/api-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 60행 `</br>` 오타(잘못된 닫는 태그) → `<br>`
- [x] [변경분] `<details>` 내부 불필요한 `<p>`/`</p>` 태그 제거 — 적절한 정리, 조치 불필요
- [참고] 41행 엔드포인트는 `https://` 정상, 죽은 링크 아님
- [참고] 서비스명 `Launching`은 콘솔 정착 영문 → 한글화 금지

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- diff는 `<details>` 블록의 `<p>`/`</p>` 제거뿐으로 깨끗함(ⓐ=G). 전체 스캔 결과 60행 `</br>` 잘못된 태그 1건 외 용어·글로서리·어미·표/코드블록 모두 양호(ⓑ=O).
