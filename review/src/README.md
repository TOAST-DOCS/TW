# 사후 검수 — 검수 결과 편집 가이드 (TW 담당자용)

이 폴더(`review/src/`)는 월별 검수 대시보드의 **원본**입니다. 담당 라이터는 여기 `reviews/*.md`만
편집하면 되고, 대시보드 HTML(`review/<월>/index.html`)은 **자동 재빌드**되므로 직접 건드리지 않습니다.

- **대시보드(보기)**: https://toast-docs.github.io/TW/review/2026-06/
- **검수 기준 상세**: [`review_ruleset.md`](./review_ruleset.md) (용어·띄어쓰기·어미·서식·오탐 가드·등급 기준)

## 폴더 구성
```
review/
├─ 2026-06/index.html      ← 빌드 결과(배포본). 자동 생성 — 직접 편집 금지
└─ src/                    ← 원본(편집 대상)
   ├─ reviews/<repo>__<문서키>.md   ← ★ 담당자가 편집하는 파일
   ├─ owners.md                     ← 서비스별 담당(작성자·검수자) 마스터
   ├─ inventory_2026-06.tsv         ← 그달 배포 문서 목록
   ├─ autoscan_2026-06.tsv          ← 자동 패턴스캔 잠정등급
   ├─ dashboard_template.html       ← 디자인/렌더 템플릿
   ├─ build_dashboard.py            ← 빌드 스크립트
   └─ review_ruleset.md             ← 검수 기준
```

## 협업 흐름

1. **분담**: 담당자 2명이 **서비스/문서 단위로 나눠** 맡습니다. `reviews/*.md`는 문서당 파일 1개라,
   서로 다른 파일을 편집하면 git 충돌이 없습니다.
2. **편집**:
   ```bash
   git clone https://github.com/TOAST-DOCS/TW.git
   cd TW
   git checkout -b review/2026-06-<본인이름>     # 작업 브랜치
   # review/src/reviews/<문서>.md 편집
   git add review/src/reviews/
   git commit -m "review(2026-06): <서비스> 검수 결과 반영"
   git push -u origin review/2026-06-<본인이름>
   ```
3. **PR 생성** (base: `master`). master 직접 push는 금지입니다.
4. **자동 재빌드**: PR이 올라오면 GitHub Action이 대시보드를 재빌드해 **같은 PR 브랜치에 커밋**합니다.
   PR diff에서 갱신된 `review/2026-06/index.html`까지 함께 확인할 수 있습니다.
5. **머지**: 리뷰 후 사람이 머지하면 배포본에 반영됩니다(1~2분 후 라이브).

## reviews/*.md 편집 규칙

각 파일은 frontmatter + `## 변경해야 할 항목` 체크리스트로 구성됩니다.

```markdown
---
service: <repo명>
path: <ko/...md>
status: <A|M>
grade_change: <G|O|R>   # ⓐ 변경분 등급
grade_full:   <G|O|R>   # ⓑ 문서 전체 등급
review_state: auto       # auto(검토 대기) → reviewing(검토중) → done(반영완료)
---
...
## 변경해야 할 항목
- [ ] [기존] 24행 `참고하시기 바랍니다` → `참고하세요`
- [x] [변경분] 6월 변경 적절 — 조치 불필요
- [ ] [참고] 통신사 고객센터 표기는 UI 경로 룰 미적용(오탐 가드)
```

검토하며 할 수 있는 작업:
- **반영 완료**: 해당 항목 `- [ ]` → `- [x]` (대시보드 '변경해야 할 항목'에서 숨겨짐)
- **과적용/오탐 삭제**: 항목 줄을 삭제하거나 `[참고]` 태그로 강등
- **등급 조정**: `grade_change`/`grade_full`을 `G|O|R`로 수정
- **상태 갱신**: `review_state`를 `reviewing` 또는 `done`으로 변경 → 대시보드 배지 반영
- 태그: `[변경분]`(이번 배포가 바꾼 것) / `[기존]`(원래 있던 이슈) / `[참고]`(메모·가드, 수정 대상 아님)
- 항목은 **1줄 1이슈**로 간결하게. 자세한 배경은 `## 참고` 섹션에.

> 등급 기준: 🔴 R(기술오류·링크깨짐·필수섹션누락·콘솔불일치) / 🟠 O(용어·글로서리·조사·어미·서식) / 🟢 G(통과).
> 자세한 기준·오탐 가드는 [`review_ruleset.md`](./review_ruleset.md) 참고.

## 수동 재빌드 (선택)
로컬에서 직접 확인하려면:
```bash
python review/src/build_dashboard.py   # → review/2026-06/index.html 재생성
```
(순수 Python 표준 라이브러리만 사용. 별도 설치 불필요.)

## 새 달 추가
1. `inventory_<YYYY-MM>.tsv` / `autoscan_<YYYY-MM>.tsv` / 그달 `reviews/*.md` 준비
2. `build_dashboard.py`의 `MONTH` 값을 해당 월로 변경
3. 빌드 → `review/<YYYY-MM>/index.html` 생성, `review/index.html`(월 목록)에 링크 추가
