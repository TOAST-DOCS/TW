---
service: notification-hub
path: ko/api-guide-v1x0/message-example.md
status: M
grade_change: O
grade_full: O
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/message-example.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [변경분] | 149행 | 신규 `<a id="sms"></a>`가 13행 `<span id="sms"></span>`와 ID 중복 | 신규 앵커 ID를 `rcs-sms` 등 고유값으로
- [변경분] | 143행 | 신규 `<a id="rcs"></a>`가 141행 `<span id="rcs"></span>`와 동일 ID 중복 | 신규 앵커 제거 또는 ID 구분
- [기존] | 300·383행 | `* mTitleMedia 아이콘 파일 ID 목록` 불릿 `*`(하위 불릿 포함) | `-`
- [기존] | 948~953행 | Email 설명 불릿 `*` | `-`
- [기존] | 1048~1051행 | Push 설명 불릿 `*` | `-`
- [기존] | 952행 | 문장 끝 trailing space | 제거
- [참고] | 463행 | FORMAT_PARAGRAPH 예시 JSON 배열 마지막 항목 뒤 trailing comma(+435행 빈 객체 `{}`) | 유효 JSON 아님, 작성자 확인 필요
- [참고] | | JSON 예시 내 `http://www.test.com` | 코드 블록 플레이스홀더라 링크 룰 비적용(수정 대상 아님)

## 참고
- 등급: ⓐ 변경분 = 수정 필요(O) / ⓑ 문서 전체 = 수정 필요(O)
- 6월 변경분은 전부 제목 앞 `<a id="...">` 앵커 추가 + 상단 `pre-align` 주석으로, 프로즈/용어/구조 변경 없음. 추가 앵커 일부가 기존 `<span id>`와 ID 중복되어 단편 링크(`#sms`·`#rcs`) 모호성 발생.
- 행번호는 원문(content) 기준. 용어·글로서리·조사·어미·필수섹션·외부링크 위반 없음(🔴 없음). 잔여 이슈는 불릿 기호 서식 및 앵커 ID 중복으로 🟠 수준.
