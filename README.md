# TOAST-DOCS/TW

NHN Cloud 테크니컬 라이팅(TW) 파트의 작업 저장소입니다. 문서 검수 지침, 사용자 가이드 템플릿, 검수 결과, 활용 가이드 원본, Meetup! 콘텐츠를 모아 둡니다.

## 디렉터리 안내

| 디렉터리 | 용도 | 별도 규칙 |
| --- | --- | --- |
| `review-guide/` | 문서 검수 지침(스타일 가이드·용어 사전). 문서를 작성하는 조직과 공유 | [review-guide/README.md](review-guide/README.md) |
| `ko/` `en/` `ja/` `zh/` | 사용자 가이드 사이트 배포용 디렉터리 구조 | |
| `user-guide-templates/` | 가이드 작성 템플릿(최신) | |
| `task-guide/` | 트러블슈팅·How-to 가이드 원본 | [task-guide/README.md](task-guide/README.md) |
| `review/` | 월별 사후 검수 대시보드와 원본 | [review/src/README.md](review/src/README.md) |
| `report/` | 검수 자동화 성과 보고서 | [report/README.md](report/README.md) |
| `meetup/` | NHN Cloud Meetup! 게시 콘텐츠 | [meetup/README.md](meetup/README.md) |

## 이름 짓기 규칙

### 왜 정하나

- **경로가 곧 URL이 됩니다.** 이 저장소는 GitHub Pages로 게시됩니다(예: `https://toast-docs.github.io/TW/review/2026-06/`). 파일과 디렉터리 이름이 그대로 주소에 들어갑니다.
- **조직 표준이 이미 하이픈입니다.** TOAST-DOCS 저장소 189개 중 139개가 하이픈을 쓰고 언더스코어는 1개뿐입니다. `Compute-Instance`, `Network-Load-Balancer`처럼 씁니다.
- 여러 명이 함께 쓰므로, 매번 고민하지 않도록 기본형을 하나로 정합니다.

### 기본형

**영소문자 kebab-case를 씁니다.** 단어 사이는 하이픈(`-`)으로 잇습니다.

```
task-guide/                      디렉터리
instance-creation-failed.md      문서
instance-creation-failed-flow.svg 이미지
```

다음은 쓰지 않습니다.

| 쓰지 않는 것 | 이유 |
| --- | --- |
| 공백 | URL에서 `%20`으로 바뀌어 주소가 길고 읽기 어려워집니다 |
| 한글 | URL 인코딩되면 사람이 읽을 수 없는 문자열이 됩니다 |
| 대문자 | 운영체제에 따라 대소문자를 구분하거나 하지 않아 충돌이 납니다 |
| 언더스코어(`_`) | 검색엔진이 단어 구분자로 인식하지 않고, 링크에 밑줄이 그이면 잘 보이지 않습니다 |
| 특수문자(`!` `?` `[` `]` 등) | 셸과 URL에서 별도 처리가 필요합니다 |

### 예외

다음은 의도적인 예외입니다. 바꾸지 않습니다.

- **`review/src/`의 스크립트와 데이터 파일** — `build_dashboard.py`, `inventory_2026-06.tsv` 등. Python 생태계 관례가 snake_case입니다.
- **`review/src/reviews/<저장소명>__<문서키>.md`** — 더블 언더스코어(`__`)는 저장소명과 문서 키를 구분하는 표시입니다. 자세한 내용은 [review/src/README.md](review/src/README.md)를 참고하세요.
- **널리 쓰이는 관례 이름** — `.github/`, `.nojekyll`, `README.md`, `CHANGELOG.md` 등. 도구나 생태계가 정한 이름은 그대로 씁니다.

### 게시된 경로는 바꾸지 않습니다

`review/2026-06/` 같은 경로는 이미 게시되어 링크가 공유돼 있습니다. 이름을 바꾸면 기존 링크가 깨지므로 **게시 이력이 있는 경로는 그대로 둡니다.**

## 브랜치와 커밋

### 브랜치

```
<유형>/<영역>/<주제>
```

- 유형: `docs`(문서 추가·수정), `chore`(정리·설정), `fix`(오류 수정)
- 영역: 작업 대상 디렉터리
- 예: `docs/task-guide/instance-creation-failed`, `chore/repo/naming-rules`

### 커밋 메시지

Conventional Commits 형식에 한국어 본문을 씁니다.

```
docs(task-guide): 인스턴스 생성 실패 트러블슈팅 가이드 추가
```

- 괄호 안 범위(scope)는 **작업한 디렉터리 이름**을 그대로 씁니다. `git log --grep`으로 찾을 때 경로와 일치해야 편합니다.
- 제목은 50자 안팎으로 쓰고, 자세한 내용은 본문에 적습니다.

## Pull Request

- **한 PR에는 한 가지 일만** 담습니다. 문서 추가와 저장소 정리를 섞지 않습니다.
- 제목은 커밋 제목과 같게 씁니다.
- 다른 사람의 파일을 건드리면 그 작성자를 리뷰어로 지정합니다.

## 정리 대상

기본형에 맞지 않는 항목입니다. 순차적으로 정리합니다.

| 대상 | 문제 | 정리 후 |
| --- | --- | --- |
| `task-guide/ko/lb-...-troubleshooting_final.md`, `..._latest.md`, `lb_troubleshooting_flowchart.svg` | 언더스코어 | 작성자 확인 필요(`_final`·`_latest` 중 어느 것을 남길지 정해야 합니다) |

`review/`는 게시된 경로이므로 정리 대상에서 제외합니다.
