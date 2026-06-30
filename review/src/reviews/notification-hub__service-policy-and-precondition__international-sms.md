---
service: notification-hub
path: ko/service-policy-and-precondition/international-sms.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# notification-hub / ko/service-policy-and-precondition/international-sms.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 20행 | UI 경로 `고객 센터 > 1:1 문의` | `고객지원 > 문의하기`
- [기존] | 20행 | `문의 바랍니다` | `문의하세요`
- [기존] | 13행 | `참고하십시오` | `참고하세요`
- [기존] | 24행 | `값이 NULL 일 수 있습니다` | `값이 NULL일 수 있습니다`
- [기존] | 37행 | `상세조회 api` | `상세조회 API`
- [참고] | 전체 | 본문 불릿 전체가 `*` (`-` 권장) | 문서 전반 스타일이라 일괄 판단 필요(기존)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 `<a id>` 앵커와 pre-align 주석만 추가(본문 변경 없음) → 변경분 G.
- 전체는 UI 경로·어미(`참고하십시오`/`문의 바랍니다`)·`api` 대소문자·`NULL 일` 띄어쓰기 등 용어·어미·표기 이슈로 O. R 근거 없음.
- 20행 `고객 센터`는 NHN Cloud 자체 지원 경로(링크 nhncloud.com/kr/support/inquiry, 페이지 표제 '문의하기')이므로 통신사 고객센터 오탐 가드 비해당. 외부 링크 2건(imweb.me 상세 가이드, support/inquiry) 도달 확인됨. 콘솔 실측 필요 항목 없음.
