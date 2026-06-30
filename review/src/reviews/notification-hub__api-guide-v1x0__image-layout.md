---
service: notification-hub
path: ko/api-guide-v1x0/image-layout.md
status: M
grade_change: G
grade_full: G
review_state: auto
---

# notification-hub / ko/api-guide-v1x0/image-layout.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [참고] | 117행 | 응답 예시 `cardImage.filePreviewUrl`이 `background.png` | `cardImage.png` 추정, 작성자 확인
- [참고] | 120행 | `body` 예시에서 `* 상품명`만 공백 있고 `*유효기간`/`*사용처`는 없음 | 샘플 일관성, 작성자 확인

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 통과
- 6월 diff는 상단 `pre-align` 주석과 각 섹션 앞 HTML 앵커(`create-image-layout` 등) 추가뿐으로 본문 텍스트·용어·서식 변경 없음 → 변경분 깨끗.
- 전체는 API 레퍼런스(약 580행)라 용어/어미/조사/서식/링크/필수섹션/표·코드블록 구조를 체계 스캔함. 글로서리·UI 경로·조사 위반 없음, 5개 엔드포인트 모두 요청/파라미터/본문/응답/예시 섹션 구조 일관, 외부·깨진 링크 없음, EN/EM DASH·NBSP 오용 없음. 지적은 JSON 예시 데이터의 사소한 불일치 2건뿐(수정 대상 아닌 참고).
