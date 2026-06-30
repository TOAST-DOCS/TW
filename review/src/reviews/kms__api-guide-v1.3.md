---
service: kms
path: ko/api-guide-v1.3.md
status: M
grade_change: G
grade_full: G
review_state: auto
---

# kms / ko/api-guide-v1.3.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [참고] | 1227·1286행 | 키 저장소 생성/수정 요청 표 `authMode`가 `필수`+`기본값: AND` 동시 표기 | 작성자 확인 필요

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 통과
- 6월 diff는 전부 오타 교정(`clientSentCertificate`·`certificate2`)·용어 표준화(`유저`→`사용자`)·JSON 예시 정합성(후행 콤마/`lifeTime` 콤마)·응답 표 필드명 정정(`value`→`name`)·신규 키 저장소 CRUD 섹션 추가로, 모두 적절(개선). 새 항목은 `[x]` 처리.
- 전체 스캔에서 `유저`·`Console`·`회원`/`멤버`·`글로사리`·`http://`·죽은 외부 링크 잔존 없음 확인.
- `ip4AuthUse`는 기존 응답 표와 동일 표기로 실제 API 필드(오타 아님). 콘솔 메뉴/경로 실측 필요 지적 없음.
- 행번호는 원문(content) 기준. 유일 미결은 `authMode` 표기 모순(작성자 확인용 `[참고]`)으로 등급에 영향 없음.
