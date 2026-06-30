---
service: ROLE
path: ko/api-guide.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# ROLE / ko/api-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [x] [변경분] 982행 URI `scope/{scopeId}/relations` → `scopes/{scopeId}/relations` (섹션 2 다른 엔드포인트와 일치, 적절)
- [ ] [기존] 482행 `부여됬는지` → `부여됐는지` (맞춤법)
- [ ] [기존] 1672행 표 행 `필요 없음.|` 뒤 군더더기 `야` → 삭제
- [ ] [기존] 833행 잘못된 태그 `</br>` → `<br/>`
- [ ] [기존] 1258행 `|Delete|` → `|DELETE|` (다른 메서드 표기와 통일)
- [ ] [기존] 1235행 3.3 Role 정보 수정 표 `description` 설명 `User 설명` → `Role 설명` (복붙 오류)
- [ ] [기존] 571행 Path Variable 표 `|userId| User ID|` 중복 행 → 1개 삭제
- [ ] [기존] 181행 `includeRelation 을`·`Role 을` 조사 앞 공백 → `includeRelation을`·`Role을`
- [ ] [기존] 252행 `한번에` → `한 번에`
- [ ] [기존] 19~20행 본문 설명에 `>` 인용 블록 → 평문 또는 `!!! tip`(`>`는 예시 블록 전용)
- [ ] [참고] 277행 Request Body 키 `usersIds`가 설명(User ID)·다른 표와 불일치 → `userIds` 오타 여부 작성자 확인
- [ ] [참고] 1976~1977행 4.7 Request Body는 `operationId`/`roleId`인데 표는 `operationId`/`scopeId` → 작성자 확인
- [ ] [참고] 1162~1163행 3.2 Role 조회 Path Variable 표의 `roleName`/`roleGroup`이 경로 변수가 아닐 수 있음 → 작성자 확인
- [ ] [참고] 전체 `[CONSOLE]` 토큰(83회)은 콘솔 링크 매크로로 보임 → `콘솔` 일괄 변환 금지, 렌더링 결과 실측 후 판단
- [ ] [참고] 1943행 헤딩 `4.7. Resource에 권한을 추가합니다.`만 서술형/마침표 → 타 헤딩 명사형과 통일 검토

## 참고
- 등급: ⓐ 변경분 = 통과(G) / ⓑ 문서 전체 = 수정 필요(O)
- ⓐ: 6월 diff는 982행 한 줄(`scope`→`scopes`)뿐이며 섹션 2의 다른 엔드포인트와 일치시키는 올바른 버그 수정이라 깨끗함.
- ⓑ: API 레퍼런스로 R급(기술 오류·링크 깨짐·필수 섹션 누락·콘솔 불일치)은 없고 맞춤법·표기·표 구조·서식의 O급만 확인됨. 1차 초안의 `[CONSOLE]→콘솔` 일괄 변환은 매크로 토큰 오버리치로 판단해 [참고]로 강등.
</content>
</invoke>
