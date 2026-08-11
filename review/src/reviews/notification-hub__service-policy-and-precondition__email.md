---
service: notification-hub
path: ko/service-policy-and-precondition/email.md
status: M
grade_change: G
grade_full: R
review_state: auto
---

# notification-hub / ko/service-policy-and-precondition/email.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 190행 | `SMPT 서버` 오타 | `SMTP 서버`
- [기존] | 200행 | `매일 내용` 오타 | `메일 내용`
- [기존] | 165행 | `Recommanations` 오타 | `Recommendations`
- [기존] | 134행 | UI 경로 `[고객 센터 > 1:1 문의]` | `[고객지원 > 문의하기]`
- [기존] | 122~133·170·171·192~213행 등 | 본문 점 목록 불릿 `*` | `-`로 통일
- [참고] | 164·165·213행 | 링크 표시 텍스트 구분자 `*`(`Gmail * Email Sender...`) | 원문 의도 확인 후 `-`/`|` 검토

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 시급
- ⓐ: 6월 diff는 섹션 `<a id>` 앵커와 상단 `pre-align` 주석 삽입뿐, 산문 변경 없음 → G.
- ⓑ: 기술 용어 오타(`SMPT`)와 콘솔 UI 경로 불일치(`고객 센터 > 1:1 문의`)가 있어 R로 상향(1차 O에서 교정).
- 134행 링크는 NHN Cloud 지원 URL이므로 통신사 고객센터 오탐 가드 비해당 → UI 경로 룰 적용 대상.
- 콘솔 메뉴 실측이 필요한 단정성 지적은 없음.
