---
service: notification-hub
path: ko/service-policy-and-precondition/sms.md
status: M
grade_change: G
grade_full: R
review_state: auto
---

# notification-hub / ko/service-policy-and-precondition/sms.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 226행 | SKT 링크 `http://www.tworld.co.kr` | `https://`
- [기존] | 252행 | SKT 링크 `http://www.tworld.co.kr` | `https://`
- [기존] | 129행 | `발신번호`(3회) | `발신 번호`(같은 단락 127·140·141행과 표기 통일)
- [참고] | 144행 | `서비스 중지`는 법적·기술적 의미 변화 가능 | 작성자 확인 필요(`중지`→`정지` 일괄 금지)
- [참고] | 229·231·255·257행 | 통신사 고객 센터 명칭·전화번호 | 외부 고객센터, `고객지원` UI 룰 미적용(원문 유지)

## 참고
- 등급: ⓐ 변경분 = 통과(G) / ⓑ 문서 전체 = 시급(R, 외부 `http://` 링크 2건).
- 6월 diff는 전부 `<a id>` 앵커 추가뿐이라 변경분은 깨끗함(ⓐ=G). 226·252행 SKT 링크가 `http://`로 남아 ⓑ=R.
