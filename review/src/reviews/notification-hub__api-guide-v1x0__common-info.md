---
service: notification-hub
path: ko/api-guide-v1x0/common-info.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/common-info.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 272행 | 링크 텍스트 `IntelliJ HTP Client` 오타 | `IntelliJ HTTP Client`
- [기존] | 274행 | 링크 텍스트 `IntelliJ HTTP Cient CLI` 오타 | `IntelliJ HTTP Client CLI`
- [기존] | 282행 | `htt-client.env.json` 오타 | `http-client.env.json`
- [기존] | 250행 | 문장 중간 마침표 `초당 요청 수. 300RPS` | `초당 요청 수, 300RPS`
- [기존] | 250행 | 조사 `300RPS(Requests Per Second)으로` | `300RPS(Requests Per Second)로`
- [기존] | 158행 | 조사 앞 공백 `지정자(Time Zone Designator) 를` | `지정자(Time Zone Designator)를`
- [기존] | 256행 | 조사 앞 공백 `(Exponential Backoff) 처럼` | `(Exponential Backoff)처럼`
- [참고] | 174/176행 | 본문은 `광고_`로 시작 명시, 176행 코드 예시는 `templateName=광고`(언더스코어 누락) | 작성자 확인

## 참고
- 등급: ⓐ 변경분 = 통과(G) / ⓑ 문서 전체 = 수정 필요(O)
- 6월 diff는 헤딩 ID 앵커·정렬 주석 추가에 한정되어 변경분 깨끗(G). 전체에는 영문 표기 오타(HTP/Cient/htt), 조사 앞 공백, 조사 받침(으로→로), 문장 중간 마침표 등 🟠급 표기·서식 이슈만 존재(깨진 링크·기술 오류·필수 섹션 누락 없음) → ⓑ=O.
- 오탐 가드 위반·콘솔 경로 실측 필요 지적 없음. 오타는 링크 표시 텍스트라 URL 유효성과 무관.
