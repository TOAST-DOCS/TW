---
service: kms
path: ko/api-guide-v1.0.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# kms / ko/api-guide-v1.0.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 208행 표 | `String |API를` 구분자 뒤 공백 누락 | `String | API를`

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 6월 diff는 오타 2건(`clientSentCertificate`·`certificate2`) + `유저→사용자` 14건이며 모두 적절. CONTENT에 `유저` 잔존 0건 재확인.
- API 레퍼런스 문서. 내부 링크(`/nhncloud/ko/...`) 정상, 외부 http·AWS 링크 없음, 이모티콘·admonition·특수문자(EN/EM DASH·NBSP) 이슈 없음. 유일한 잔이슈는 208행 표 셀 공백 누락(렌더 영향 미미).
