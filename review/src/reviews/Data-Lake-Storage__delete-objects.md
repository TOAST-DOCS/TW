---
service: Data-Lake-Storage
path: ko/delete-objects.md
status: A
grade_change: O
grade_full: O
review_state: auto
---

# Data-Lake-Storage / ko/delete-objects.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [변경분] | 15~18행 | 요청 XML 플레이스홀더가 `string`/`timestamp`/`long`(소문자)인데 `Boolean`(18행)만 대문자 | 케이스 통일
- [변경분] | 42행 | 본문 표 `LastModifiedTime` 타입은 `String`인데 XML 예시(17행)는 `timestamp` | 타입 표기 일치
- [참고] | 본문 표 | 설명 셀이 명사형·종결형 혼재 | API 레퍼런스에서 흔한 패턴으로 강제 통일 대상 아님(작성자 판단)

## 참고
- 등급: ⓐ 변경분 = 수정 필요(서식) / ⓑ 문서 전체 = 수정 필요(서식). status=A 신규 문서라 ⓐ=ⓑ.
- 74행 API 레퍼런스 문서. 용어/조사/어미/링크/필수 섹션 위반 없음(Console·회원·IAM 멤버·고객센터·버킷명 미검출). 남은 지적은 코드 예시·표 표기 일관성(서식 🟠)이며 기술 오류는 아님.
- 1차 초안의 `Content-MD5` 헤더/파라미터 지적은 삭제: 표에 `구분` 열로 Header/Path가 명시되어 있어 비이슈.
- 외부 http(s) 링크·콘솔 메뉴 동선 실측 필요 항목 없음(순수 API 레퍼런스, 링크는 상대경로 `api-guide-common` 1건).
