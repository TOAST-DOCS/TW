---
service: TOAST-Cloud
path: ko/public-api/supported-authentication-methods.md
status: M
grade_change: G
grade_full: G
review_state: auto
---

# TOAST-Cloud / ko/public-api/supported-authentication-methods.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [x] [변경분] 61행 `Load Balancer(DSR)` 행 추가 — 기존 `Load Balancer` 행과 IaaS 토큰 `O` 표기·정렬 일관, 조치 불필요
- [x] [변경분] 124행 `EasyQueue` 행 추가 — Data & Analytics 카테고리·User Access Key 토큰 `O` 표기 일관, 조치 불필요
- [ ] [참고] 표 내 영문 서비스명(Instance, Load Balancer 등)은 서비스 직접 지칭 → 정착 영문 유지(글로서리 한글화 미적용)
- [ ] [참고] 143행 `에서 확인할 수 있습니다`는 링크 마무리 표현 → 원문 유지

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 통과
- 6월 diff는 표 행 2건 추가뿐이며 기존 행과 형식·정렬·표기 일관. `Console`·`회원`·`그룹태그`·UI 경로·중지/정지 등 룰셋 위반 없음.
- 본문은 서비스별 API 인증 표(레퍼런스). EN DASH/EM DASH/NBSP 해당 없음, `!!! tip "알아두기"` 4칸 들여쓰기 정상. 143행 등 docs.nhncloud.com 링크는 https 정상(깨진 `http://`·AWS 링크 아님).
