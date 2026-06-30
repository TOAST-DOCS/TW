---
service: pipeline
path: ko/release-notes.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# pipeline / ko/release-notes.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 37~188행 본문 불릿 기호가 전부 `*` → `-`로 통일
- [ ] [기존] 51행 `fade-out됩니다` vs 107행 `Fade-out 예정` 대소문자 혼용 → 표기 통일
- [x] [변경분] 62행 파이프라인 알림 가이드 앵커 `#_13`→`#_11` 정규화 — 적절
- [x] [변경분] 162행 API 링크 `api-guide/api-guide-v1-0#pipeline`→`api-guide-v1-0/#pipeline` 정규화 — 적절
- [x] [변경분] 178행 API 가이드 링크 `api-guide/api-guide-v1-0`→`api-guide-v1-0` 정규화 — 적절
- [ ] [참고] 130행 `AI EasyMaker`는 서비스명이므로 영문 유지 (수정 불필요)
- [ ] [참고] 166행 `api-pipeline.cloud.toast.com`은 과거 이력 기술상 도메인이므로 유지 (수정 불필요)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 내부 링크 경로·앵커 정규화 3건뿐이며 모두 적절(외부 http·죽은 링크 없음) → 변경분 G.
- 전체는 본문 불릿이 전부 `*`(룰셋 `-` 권장)이고 fade-out 대소문자 혼용이 있어 서식 등급 O. 기술 오류·외부 링크 깨짐·필수 섹션 누락은 없음.
- 문서 구조는 H2(`##`)=제목 / H3(`###`)=날짜로, 룰셋의 H1=제목 권장과 다르나 TOAST-DOCS 릴리스 노트 정착 관행이라 강제하지 않음.
- diff의 링크 정규화 3건은 내부 경로 변경이라 라이브 콘솔/렌더 대조 없이 단정 불가하나, 6월 배포 본에 이미 반영된 변경이라 별도 액션 불요.
