---
service: Network-ACL
path: ko/public-api.md
status: M
grade_change: G
grade_full: R
review_state: auto
---

# Network-ACL / ko/public-api.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [x] [변경분] 17행 도입 문단을 IaaS 토큰 안내로 교체 → 용어·어미(`참고하세요`)·내부 링크 모두 적절, 조치 불필요
- [ ] [기존] 339·340행 `dst_port_range_max`=`최솟값`, `dst_port_range_min`=`최댓값`으로 뒤바뀜 → max=최댓값, min=최솟값으로 수정(`src_port_range`는 정상)
- [ ] [기존] 435·436행 `acl_rule.dst_port_range_max/min` 최솟값·최댓값 뒤바뀜 → max=최댓값, min=최솟값
- [ ] [기존] 498·499행 `acl_rule.dst_port_range_max/min` 최솟값·최댓값 뒤바뀜 → max=최댓값, min=최솟값
- [ ] [기존] 539·540행 `acl_rule.dst_port_range_max/min` 최솟값·최댓값 뒤바뀜 → max=최댓값, min=최솟값
- [ ] [기존] 649·650행 `acl_rule.dst_port_range_max/min` 최솟값·최댓값 뒤바뀜 → max=최댓값, min=최솟값
- [ ] [기존] 614행 ACL Rule 수정(PUT) 요청 표 `aclRuleId` 설명 `삭제할 ACL Rule ID` → `수정할 ACL Rule ID`
- [ ] [기존] 160행 `넣는것을` → `넣는 것을`(의존명사 띄어쓰기)
- [ ] [기존] 602행 `수정 가능 합니다` → `수정 가능합니다`
- [ ] [기존] 342·438·501·542·652행 `적용순서` → `적용 순서`(띄어쓰기)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 시급
- 6월 diff는 도입 문단 한 곳(15→17행)만 교체했고 IaaS 토큰 설명·내부 링크·어미가 모두 표준에 부합 → 변경분 자체는 깨끗함.
- 시급(R) 사유는 변경분이 아닌 기존 응답 표의 `dst_port_range_min/max` 설명 최솟값↔최댓값 뒤바뀜(기술 오류, 5개 표 반복) 및 614행 `삭제할`→`수정할` 오기.
- [참고] JSON 예시 ID 표기 불일치(358·379·455행 `47fcb3d9` 하이픈 누락 vs 669행 `47fc-b3d9` 정상)는 예시 데이터라 영향 낮음. 일관성 차원에서 라이터 확인 권장.
