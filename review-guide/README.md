# 문서 검수 지침

NHN Cloud 기술 문서를 작성하고 검수할 때 쓰는 공통 기준입니다. NHN Cloud 테크니컬 라이팅(TW) 파트가 관리하며, 기술 문서를 작성하는 조직이 같은 기준으로 자동 검수를 수행할 수 있도록 공개합니다.

## 구성

| 파일 | 내용 | 쓰임 |
| --- | --- | --- |
| [style-guide.md](style-guide.md) | 문체·표기·서식 규칙 | 문장을 어떻게 쓰는지 |
| [glossary.md](glossary.md) | 서비스명과 기술 용어의 한국어·영어·일본어 표기 | 어떤 낱말을 쓰는지 |

두 파일은 함께 씁니다. 스타일 가이드가 문장 규칙을, 용어 사전이 표기 기준을 담당합니다.

## 자동 검수에 쓰는 방법

AI 도구에 두 파일을 지침으로 주고 검수 대상 문서를 함께 넘기면 됩니다. 도구는 무엇을 쓰든 관계없습니다.

### 파일을 직접 참조할 때

특정 버전을 고정해 참조하면 검수 결과를 재현할 수 있습니다.

```
https://raw.githubusercontent.com/TOAST-DOCS/TW/review-guide/v1.0/review-guide/style-guide.md
https://raw.githubusercontent.com/TOAST-DOCS/TW/review-guide/v1.0/review-guide/glossary.md
```

`review-guide/v1.0` 자리에 [태그](https://github.com/TOAST-DOCS/TW/tags) 이름을 넣습니다. `master`를 쓰면 항상 최신 내용을 받지만, 지침이 바뀌면 같은 문서를 다시 검수해도 결과가 달라질 수 있습니다.

### 저장소를 받아 쓸 때

CI에서 검수를 돌리거나 지침을 로컬에 두고 쓸 때는 태그를 지정해 받습니다.

```sh
git clone --depth 1 --branch review-guide/v1.0 https://github.com/TOAST-DOCS/TW.git
```

### 프롬프트 예시

```
아래 두 지침에 근거해 이 문서를 검수해 주세요.
- 스타일 가이드: (style-guide.md 내용)
- 용어 사전: (glossary.md 내용)

지침에 명확히 어긋나는 항목은 수정안을 제시하고, 판단이 필요한 항목은
근거와 함께 따로 표시해 주세요.
```

검수 결과에는 어느 버전을 기준으로 했는지 함께 적어 두면 나중에 지침이 바뀌었을 때 차이를 추적할 수 있습니다.

## 버전 관리

| 층 | 무엇을 알 수 있나 |
| --- | --- |
| [태그](https://github.com/TOAST-DOCS/TW/tags) | 고정해 참조할 수 있는 버전 |
| [CHANGELOG.md](CHANGELOG.md) | 무엇이 언제 왜 바뀌었나 |
| Git 이력 | 어느 줄이 어떻게 바뀌었나 |

버전은 `review-guide/v<major>.<minor>` 형식으로 붙입니다.

- **major** — 검수 결과가 크게 달라지는 변경. 규칙 체계나 판단 기준이 바뀔 때
- **minor** — 규칙·용어 추가나 수정, 설명 보완

지침이 바뀌면 CHANGELOG에 기록하고 새 태그를 붙입니다. 이미 붙인 태그는 옮기거나 지우지 않습니다.

## 변경 사항 확인

지침은 계속 다듬어집니다. 새 버전이 나온 것을 알고 올릴지 판단하는 흐름은 다음과 같습니다.

### 알림 받기

저장소 오른쪽 위 **Watch** → **Custom** → **Releases**만 체크합니다. 새 버전을 발행할 때 알림이 옵니다. 이슈나 Pull Request 알림은 오지 않습니다.

### 무엇이 바뀌었는지 보기

[Releases](https://github.com/TOAST-DOCS/TW/releases)에 버전별 요약이, [CHANGELOG.md](CHANGELOG.md)에 전체 이력이 있습니다. 어느 줄이 어떻게 바뀌었는지는 두 버전을 비교해 봅니다.

```
https://github.com/TOAST-DOCS/TW/compare/review-guide/v1.0...review-guide/v1.1
```

### 올릴지 판단하기

- **minor** — 규칙이나 용어가 추가되고 설명이 보완된 것입니다. 올려도 기존 검수 결과가 뒤집히지 않습니다.
- **major** — 규칙 체계나 판단 기준이 바뀐 것입니다. 이미 검수한 문서를 다시 볼지 함께 검토하세요.

### 쓰고 있는 버전 확인하기

참조 URL이나 clone 명령에 적어 둔 태그가 지금 쓰고 있는 버전입니다. 최신 버전은 다음으로 확인합니다.

```sh
curl -s https://api.github.com/repos/TOAST-DOCS/TW/releases/latest | grep tag_name
```

검수 파이프라인에서 이 값을 쓰고 있는 버전과 비교해, 다르면 경고를 남기는 방식도 쓸 수 있습니다.

## 의견과 문의

- 규칙이나 용어에 대한 제안, 문서에 없어서 판단이 어려웠던 사례는 이 저장소의 [Issue](https://github.com/TOAST-DOCS/TW/issues)로 남겨 주세요. 어떤 문서를 검수하다 막혔는지 함께 적어 주시면 판단이 빠릅니다.
- 직접 수정안을 제안할 때는 Pull Request를 보내 주세요. 반영 여부는 TW 파트가 판단하고, 반영된 내용은 CHANGELOG에 남습니다.
- 공개 저장소이므로 Issue와 PR에 고객사명, 리소스 ID, 사내 시스템 링크를 쓰지 않습니다.
- 자동 검수에 적용하고 계시면 Issue로 알려 주세요. 규칙 체계를 바꾸는 변경을 계획할 때 영향 범위를 파악하는 데 도움이 됩니다.

## 이용 범위

NHN Cloud 기술 문서의 표기 일관성을 위해 공개하는 내부 작성 기준입니다. 참고와 인용은 자유롭게 하실 수 있으나, NHN Cloud 공식 문서 정책이나 제품 사양을 보증하는 문서는 아닙니다.
