---
service: Gamebase
path: ko/ios-push.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# Gamebase / ko/ios-push.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [x] [변경분] 256행 `확인해 주시길 바랍니다` → `확인하세요` 적절
- [x] [변경분] 257행 `상세 오류를 확인하십시오` → `확인하세요` 적절
- [x] [변경분] 259행 `[고객 센터](toast.com)` → `[고객지원 > 문의하기](nhncloud.com)` 적절(링크 도달 확인)
- [ ] [기존] 34행 `ANPS JWT` 오타 → `APNS JWT`
- [ ] [기존] 36행 `#### Gamebase Console 등록` → `Gamebase 콘솔 등록`
- [ ] [기존] 247행 `참고하시기 바랍니다` → `참고하세요`
- [ ] [기존] 34·37·40·44·45·166·177·246·247·263·264·277행 불릿 `*` → `-`
- [ ] [기존] 44행 `Push Notifications **항목` 굵게 표기 앞 군더더기 공백 제거
- [ ] [참고] 34·40행 링크 구 도메인 `docs.toast.com` → 신 도메인 301 리다이렉트로 도달됨(죽은 링크 아님), 교체는 작성자 판단

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff(Error Handling 표 어미·UI경로·링크 갱신)는 모두 적절하고 오류메시지 보존 가드와 충돌 없어 ⓐ=G.
- 기존 이슈는 `ANPS` 오타·`Console` 미한글화·`참고하시기 바랍니다`·`*` 불릿 다수로 모두 🟠 수준이라 ⓑ=O. 링크는 리다이렉트로 도달되어 R 사유 없음.
- 34행 `Console Guide`는 NHN Cloud 문서 메뉴 고유명칭으로 한글화 제외.
