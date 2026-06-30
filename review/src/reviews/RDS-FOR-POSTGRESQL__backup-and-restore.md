---
service: RDS-FOR-POSTGRESQL
path: ko/backup-and-restore.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# RDS-FOR-POSTGRESQL / ko/backup-and-restore.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [기존] 89행 불릿 기호 `*` → `-`
- [ ] [기존] 90행 불릿 기호 `*` → `-`
- [ ] [기존] 106행 불릿 기호 `*` → `-`
- [ ] [기존] 107행 불릿 기호 `*` → `-`
- [ ] [기존] 125행 불릿 기호 `*` → `-`
- [ ] [기존] 129행 불릿 기호 `*` → `-`
- [ ] [기존] 133행 불릿 기호 `*` → `-`
- [ ] [기존] 202행 불릿 기호 `*` → `-`
- [ ] [기존] 203행 불릿 기호 `*` → `-`
- [ ] [기존] 204행 불릿 기호 `*` → `-`
- [ ] [기존] 89행 `참고합니다` → `참고하세요`(어미 통일)
- [ ] [기존] 137행 `> [주의]` 인용 → MkDocs admonition `!!! danger`(본문 4칸 들여쓰기)
- [ ] [기존] 173행 `> [참고]` 인용 → MkDocs admonition `!!! tip`(본문 4칸 들여쓰기)
- [ ] [기존] 181행 `> [주의]` 인용 → MkDocs admonition `!!! danger`(본문 4칸 들여쓰기)
- [참고] 216~218행 Timestamp 복원이 2단계→1단계로 통합(`pitr-02` 이미지 삭제) → 동작 의미 변화, 작성자 확인 필요
- [x] [변경분] 이미지 URL 날짜 갱신(20260609) — 적절, 조치 불필요
- [참고] 90행 PostgreSQL 외부 링크(`https://www.postgresql.org/docs/17/app-pgbasebackup.html`) HTTP 200 도달 확인 — 정상

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 변경분은 이미지 날짜 갱신과 Timestamp 복원 단계 통합뿐 → 용어·조사·어미·서식 신규 결함 없음(`grade_change=G`).
- 전체는 기술 오류·링크 깨짐·필수 섹션 누락 없음. `*` 불릿·`>` 노트 박스·`참고합니다` 등 서식·어미 이슈 다수(`grade_full=O`).
- 콘솔 경로 단정 지적 없음(화면 캡처는 6월 갱신본). 외부 링크 1건 도달 확인됨.
