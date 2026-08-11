---
service: CDN
path: ko/api-guide-v3.0.md
status: A
grade_change: R
grade_full: R
review_state: auto
---

# CDN / ko/api-guide-v3.0.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

> 신규(A) 문서이므로 변경분=전체입니다. 모든 지적은 `[변경분]`(=전체)으로 태깅했고 ⓐ=ⓑ로 동일하게 판정했습니다.

## 변경해야 할 항목

- [변경분] | 636행 | 서비스 삭제 `domains` 타입이 `String`이나 예시는 배열 | `List`로 수정
- [변경분] | 701행 | Auth Token 생성 `multipleWildcardPath` 타입이 `String`이나 예시는 배열 | `List`로 수정
- [변경분] | 704·705·1380행 | 불릿 기호 `*` | `-`로 변경
- [변경분] | 19·23행 | `발급 받은`(띄어쓰기)이 1177행 `발급받은`과 불일치 | `발급받은`으로 통일

## 참고
- [참고] 924·1160·1241·1319행 필드 표에 `domain.validationScope`가 있으나 응답 JSON 예시에는 키가 없음 → 예시 추가/표 제거 중 작성자 확인 필요.
- [참고] 콜백/검증 예시 URL의 `http://test.callback.com/...`, `http://cdn.example.com/.well-known/...`, `http://dcv.akamai.com/...`는 코드 블록 내 예시 값/Akamai 검증 대상이므로 `http://` UI 룰 미적용(오탐 가드).
- [참고] 156·565행 `forwardHostHeader`가 "필수"인데 192·582행 보조 설명은 기본값(domainAlias 설정 시 REQUEST_HOST_HEADER, 미설정 시 ORIGIN_HOSTNAME) 존재 → 필수/기본값 모순, 작성자 확인 필요(동작 의미 변경 → 임의 수정 금지).
- [참고] 169행 `defaultMaxAge` 기본값 `0`인데 설명 "기본값 0은 604,800초입니다"가 모호 → 작성자 확인 필요.
- [참고] 177행(생성)·567행(수정) `rootPathAccessControl.enable` 기본값이 `true`/`false`로 상이 → 의도 여부 작성자 확인 필요.
- [참고] 내부 링크 `./console-guide/#_7`, `./console-guide/#auth-token` 등은 MkDocs 자동 생성 앵커 → 콘솔 가이드 배포본 기준 앵커 유효성 1회 점검 권장(현 시점 외부 검증 불가).
- [참고] `Appkey`/`appKey`(URI 변수) 혼용은 서비스/스펙 정착 표기로 판단해 제외.
- [참고] 콜백 응답 본문의 "생성, 수정, 일시 정지, 재개, 삭제" 상태 표현은 상태 코드 표(SUSPEND=정지 등)와 일관됨.

- 등급: ⓐ 변경분 = 시급 / ⓑ 문서 전체 = 시급 (신규 문서로 ⓐ=ⓑ)
- `domains`·`multipleWildcardPath` 두 필드의 타입(String) vs 예시(배열) 불일치는 API 레퍼런스 기술 오류라 🔴. 그 외 불릿 `*`→`-`, `발급 받은` 표기 통일이 서식·표기 이슈. 필수 섹션·코드 펜스는 정상.
