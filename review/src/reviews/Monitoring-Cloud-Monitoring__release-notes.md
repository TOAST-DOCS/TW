---
service: Monitoring-Cloud-Monitoring
path: ko/release-notes.md
status: M
grade_change: O
grade_full: O
review_state: auto
---

# Monitoring-Cloud-Monitoring / ko/release-notes.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [변경분] | 222행 등 전체 | 불릿 기호 `*` | `-`로 통일
- [변경분] | 216행 | 제목이 `##`라 날짜 헤딩과 동일 레벨 | 제목은 `#`(H1)로
- [참고] | 224행 | DCGM·GPU 영역명 등 기술 사실 | 작성자 확인 권장(릴리스 노트 서술, 콘솔 실측 대상 아님)

## 참고
- 등급: ⓐ 변경분 = 수정 필요(O) / ⓑ 문서 전체 = 수정 필요(O)
- 6월 diff는 2026.06.23 항목 신규 추가 + 문서 전체를 날짜=`##`/카테고리=`###`/중첩 `*` 불릿으로 reformat. reformat이 전반에 걸쳐 변경분=전체가 사실상 동일 범위.
- 핵심 이슈는 서식 둘: (1) 전면 `*` 불릿(→ `-`), (2) 제목과 날짜 헤딩 동일 `##` 레벨(제목은 H1). 기술 오류·링크 깨짐·필수 섹션 누락·콘솔 불일치 없어 R 아님.
