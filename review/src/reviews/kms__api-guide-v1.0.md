---
service: kms
path: ko/api-guide-v1.0.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# kms / ko/api-guide-v1.0.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 208행 표 셀 `String |API를` 구분자 뒤 공백 누락 → `String | API를`
- [x] [변경분] 201행 `clientSentCerfificate` → `clientSentCertificate` 오타 수정(적절)
- [x] [변경분] 936행 `certtificate2` → `certificate2` 오타 수정(적절)
- [x] [변경분] 600·602·639·641·728·730·772·774·845·847·916·918·990·992행 `생성/수정 유저` → `생성/수정 사용자` 용어 정정(적절, `유저` 전수 제거 확인)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 6월 diff는 오타 2건(`clientSentCertificate`·`certificate2`) + `유저→사용자` 14건이며 모두 적절. CONTENT에 `유저` 잔존 0건 재확인.
- API 레퍼런스 문서. 내부 링크(`/nhncloud/ko/...`) 정상, 외부 http·AWS 링크 없음, 이모티콘·admonition·특수문자(EN/EM DASH·NBSP) 이슈 없음. 유일한 잔이슈는 208행 표 셀 공백 누락(렌더 영향 미미).
