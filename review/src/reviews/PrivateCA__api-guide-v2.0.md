---
service: PrivateCA
path: ko/api-guide-v2.0.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# PrivateCA / ko/api-guide-v2.0.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 43행 `User Access Key 토큰](...)를 참고하세요` → 받침 있는 `토큰` 뒤 조사 `를`을 `을`로 (`...token/)을 참고하세요`)
- [ ] [기존] 189~207행 저장소 목록 응답 표에 예시(167~169행)의 `totalEabCnt`/`activeEabCnt`/`deletedEabCnt` 필드 설명 누락 → 표에 추가
- [ ] [기존] 266~284행 저장소 상세 응답 표에 예시(249~251행)의 `totalEabCnt`/`activeEabCnt`/`deletedEabCnt` 필드 설명 누락 → 표에 추가
- [x] [변경분] 1170·1182행 템플릿 생성 응답에 `attributes` 필드 추가 — 어미(`직렬화한 문자열입니다`/`참조하세요`)·서식·용어 모두 적정, 조치 불필요
- [ ] [참고] 1012행 `"maxTTL": "31536000"`(String)와 1170행 `attributes` 내 `"maxTTL":31536000`(Number) 표기 차이 → 직렬화 형식 차이로 보이나 작성자 확인 필요

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요(조사 1건 + 응답 표 필드 누락 2건)
- 6월 diff는 템플릿 생성 응답에 `attributes` 필드 한 건 추가뿐이며 깨끗함(ⓐ=G).
- 문서가 길어(1774행) 줄별 비평 대신 용어/글로서리/조사/어미/서식/링크/표·코드블록 구조를 체계적으로 스캔함. admonition(`!!! danger`/`!!! note`)·불릿(`-`)·코드블록·엔드포인트 `https://`는 모두 정상. 콘솔 메뉴/경로 실측이 필요한 지적은 없음.
