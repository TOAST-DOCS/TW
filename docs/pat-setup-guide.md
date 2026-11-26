# 실전 가이드 대시보드 — 설정 안내

이 문서는 대시보드 사용과 변경 관리 스킬 실행에 필요한 설정을 안내합니다.

---

## A. 대시보드 체크박스용 GitHub PAT

대시보드의 **변경 관리 확인 완료** 체크박스를 사용하려면 GitHub Personal Access Token(PAT)이 필요합니다.
체크박스를 클릭하면 대시보드가 이 토큰으로 `TOAST-DOCS/TW` 리포의 `data/resolved.json`에 확인 이력을 커밋합니다.

### A-1. PAT 발급

1. GitHub에 로그인한 뒤 **Settings > Developer settings > Personal access tokens > Tokens (classic)** 으로 이동합니다.
   - 직접 이동: https://github.com/settings/tokens
2. **Generate new token (classic)** 을 클릭합니다.
3. 아래와 같이 설정합니다.
   - **Note**: `TW-dashboard` (식별용 이름, 자유롭게 지정)
   - **Expiration**: 90 days 또는 Custom (최대 1년)
   - **Scopes**: `repo` 체크 (리포지터리 읽기/쓰기)
4. **Generate token**을 클릭하고, 표시되는 토큰(`ghp_...`)을 복사합니다.
   - 이 토큰은 한 번만 표시되므로 반드시 바로 복사하세요.

### A-2. 대시보드에 토큰 등록

1. 실전 가이드 대시보드(https://toast-docs.github.io/TW/)를 엽니다.
2. 페이지 상단의 **GitHub 토큰 설정** 영역에 복사한 토큰을 붙여넣고 **저장**을 클릭합니다.
3. "GitHub 연결됨"이 표시되면 설정 완료입니다.

### A-3. 참고 사항

- 토큰은 브라우저의 localStorage에 저장됩니다. 다른 브라우저나 시크릿 모드에서는 다시 입력해야 합니다.
- 토큰 만료 시 GitHub에서 새 토큰을 발급받아 다시 등록하면 됩니다.
- **연결 해제** 버튼을 클릭하면 브라우저에서 토큰이 삭제됩니다.
- `TOAST-DOCS/TW` 리포에 Write 권한이 있어야 체크박스가 정상 동작합니다.

---

## B. 변경 관리 스킬(update-guide) 실행 환경

대시보드에서 "현행화 프롬프트 복사" 버튼으로 복사한 프롬프트를 Claude Code에 붙여넣어 변경 관리 작업을 수행합니다.

### B-1. 리포 fork 및 클론

1. GitHub에서 `TOAST-DOCS/TW` 리포를 본인 계정으로 fork합니다.
2. fork한 리포를 로컬에 클론합니다.
   ```sh
   git clone https://github.com/{본인계정}/TW.git
   cd TW
   git remote add upstream https://github.com/TOAST-DOCS/TW.git
   ```
3. 작업 전에 upstream을 최신으로 동기화합니다.
   ```sh
   git fetch upstream
   git rebase upstream/master
   ```

### B-2. Claude Code 실행 위치

스킬의 프롬프트가 가이드 파일을 **상대 경로**(`task-guide/ko/xxx.md`)로 참조하므로, 반드시 **클론한 리포의 루트 폴더**에서 Claude Code를 실행해야 합니다.

### B-3. `.env` 파일 설정 (선택)

대시보드의 프롬프트 복사 버튼은 **diff 전문을 프롬프트에 포함**하므로, 대부분의 경우 `.env` 없이도 스킬이 정상 동작합니다.

다만 diff 전문이 빠진 경우(수동 입력 등) 스킬이 GHE API를 호출해야 하므로, 미리 설정해 두면 편합니다.

1. 리포 루트의 `.env.example`을 복사합니다.
   ```sh
   cp .env.example .env
   ```
2. `.env` 파일에 GHE PAT를 입력합니다.
   ```
   GHE_TOKEN={본인의 GHE Personal Access Token}
   ```
3. GHE PAT 발급: https://github.nhnent.com/settings/tokens 에서 **Generate new token**을 클릭하고, `repo` 스코프를 선택합니다.

> `.env`는 `.gitignore`에 포함되어 있어 커밋되지 않습니다.

### B-4. 작업 흐름 요약

```
1. 대시보드에서 "현행화 프롬프트 복사" 클릭
2. 리포 루트에서 Claude Code 실행
3. 복사한 프롬프트 붙여넣기
4. 스킬이 분석 → 수정안 제시 → 건별 컨펌 → 커밋/푸시
5. 필요 시 PR 생성
```
