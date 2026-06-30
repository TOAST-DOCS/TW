---
service: Gamebase
path: ko/release-notes-android.md
status: M
grade_change: O
grade_full: O
review_state: auto
---

# Gamebase / ko/release-notes-android.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [변경분] | 33행 | `OneStore V21` | `ONE store v21` (문서 표준 표기, 550행 등 참고)
- [참고] | 31행 | 의존성 표기 `NHN Cloud IAP SDK (1.12.0) -> NHN IAP SDK (2.1.0)` | 모듈명 정확성 작성자 확인 권장
- [참고] | 31~33행 | 불릿 `*` 사용(룰셋은 `-` 권장) | 문서 전체가 `*` 관례, 일괄 변경은 작성자 판단

## 참고
- 등급: ⓐ 변경분 = 수정 필요(🟠) / ⓑ 문서 전체 = 수정 필요(🟠)
- 6월 diff는 2.81.0 절 추가 1건. 구조·어미·링크 모두 적합하며, `OneStore` 표기만 문서 표준(`ONE store`)과 어긋나 ⓐ를 🟠로 판정.
- 1차 초안의 `->`→`-&gt;` 지적은 삭제: 룰셋 근거 없음 + 591행이 본문에서 `->`를 그대로 사용(과적용 오탐).
- ⓑ 전체 스캔: 외부 링크 모두 `https://`(깨짐 없음), `회원`(1382·1734행)은 오류코드·회원탈퇴 기능 명칭이라 계정 변환 대상 아님, `고객 센터`는 Gamebase SDK 기능명이라 UI 경로 룰 비적용. 기술 오류·필수 섹션 누락 없음.
