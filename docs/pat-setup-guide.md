# 실전 가이드 대시보드 — GitHub PAT 설정 안내

대시보드의 **현행화 확인 완료** 체크박스를 사용하려면 GitHub Personal Access Token(PAT)이 필요합니다.
체크박스를 클릭하면 대시보드가 이 토큰으로 `TOAST-DOCS/TW` 리포의 `data/resolved.json`에 확인 이력을 커밋합니다.

## 1. PAT 발급

1. GitHub에 로그인한 뒤 **Settings > Developer settings > Personal access tokens > Tokens (classic)** 으로 이동합니다.
   - 직접 이동: https://github.com/settings/tokens
2. **Generate new token (classic)** 을 클릭합니다.
3. 아래와 같이 설정합니다.
   - **Note**: `TW-dashboard` (식별용 이름, 자유롭게 지정)
   - **Expiration**: 90 days 또는 Custom (최대 1년)
   - **Scopes**: `repo` 체크 (리포지터리 읽기/쓰기)
4. **Generate token**을 클릭하고, 표시되는 토큰(`ghp_...`)을 복사합니다.
   - 이 토큰은 한 번만 표시되므로 반드시 바로 복사하세요.

## 2. 대시보드에 토큰 등록

1. 실전 가이드 대시보드(https://toast-docs.github.io/TW/)를 엽니다.
2. 페이지 상단의 **GitHub 토큰 설정** 영역에 복사한 토큰을 붙여넣고 **저장**을 클릭합니다.
3. "GitHub 연결됨"이 표시되면 설정 완료입니다.

## 3. 참고 사항

- 토큰은 브라우저의 localStorage에 저장됩니다. 다른 브라우저나 시크릿 모드에서는 다시 입력해야 합니다.
- 토큰 만료 시 GitHub에서 새 토큰을 발급받아 다시 등록하면 됩니다.
- **연결 해제** 버튼을 클릭하면 브라우저에서 토큰이 삭제됩니다.
- `TOAST-DOCS/TW` 리포에 Write 권한이 있어야 체크박스가 정상 동작합니다.
