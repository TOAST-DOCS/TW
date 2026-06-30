---
service: kms
path: ko/api-guide-v1.2.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# kms / ko/api-guide-v1.2.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 894·920행 키 삭제 응답 `keyId` 설명 `생성된 키 ID` → `키 ID`(삭제 응답이라 '생성된' 부적절)
- [x] [변경분] `유저` → `사용자` 일괄 정정(creationUser/lastChangeUser 설명) — 적절
- [x] [변경분] 391행 `clientSentCerfificate` → `clientSentCertificate` 오타 — 적절
- [x] [변경분] 1683행 `certtificate2` → `certificate2` 오타 — 적절
- [x] [변경분] 인증서 응답 표 `value` → `name`(본문 필드명 일치) — 적절
- [x] [변경분] JSON 예시 콤마(940·1018행 등)·표 셀 여백 정정 — 적절

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(경미)
- 6월 diff는 전부 오타·JSON 문법·표 여백·유저→사용자 정정으로 모두 적절. 새 이슈 없음 → ⓐ=G.
- 용어 `NHN Cloud 계정`·`IAM 계정`(307행) 올바름. 외부/죽은 링크 없음(상대경로 `/nhncloud/...`).
- 키 생성 응답(785·825·865행)은 `생성된 키 ID`가 맞고, 삭제 응답(894·920행)만 '생성된' 수식이 어색(경미) → ⓑ=O.
