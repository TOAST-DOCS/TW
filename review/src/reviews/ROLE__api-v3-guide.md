---
service: ROLE
path: ko/api-v3-guide.md
status: M
grade_change: G
grade_full: R
review_state: auto
---

# ROLE / ko/api-v3-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 2488~2491행 `GetAllResourceIds.Request` 필드-설명 교차 오기(`operationIds`↔리소스 ID, `userIds`↔Operation ID) → 필드 의미에 맞게 교정(정확한 매핑 작성자 확인)
- [ ] [기존] 2828·2840·2853·2866·2879행 `Set<...>` 미이스케이프 `<` → `Set&lt;...>`(HTML 렌더 깨짐)
- [ ] [기존] 2843~2880행 `SearchResourceHierarchy.ResourceHierarchyProtocol` 표 4회 중복 → 1개만 남기고 정리
- [ ] [기존] 2882행 떠도는 링크 `(../Models/SearchResourceHierarchy.ResourceHierarchyProtocol.md)` → 삭제
- [ ] [기존] 2970행 `역할 Id` → `역할 ID`(대소문자 통일)
- [ ] [기존] 3746·3747행 `사용할수 있는` → `사용할 수 있는`(띄어쓰기)
- [ ] [기존] 2534행 `Path 가` → `Path가`, `둘다` → `둘 다`(띄어쓰기)
- [x] [변경분] 1937행 표 링크 `.../relations}` → `.../relations` 잘못된 `}` 제거(앵커 수정), 적절한 버그 수정
- [참고] 33행 `참고합니다`는 `~항목을 참고합니다` 표현이라 원문 유지(어미 통일 강제 금지)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 시급
- ⓐ 6월 diff는 단일 변경(표 링크의 잘못된 `}` 제거)으로 깨끗한 버그 수정 → G.
- ⓑ는 필드-설명 교차 오기(기술 오류)로 R. 그 외 미이스케이프 `<`·중복 표·떠도는 링크·대소문자·띄어쓰기 누적.
- 글로서리(Console·그룹태그·회원·멤버·버킷명·고객 센터) 위반 없음, 외부 `http://`·EN/EM 대시·NBSP·이모티콘 없음. 콘솔 메뉴/경로 실측 필요 지적 없음.
