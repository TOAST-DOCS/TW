---
service: Deploy
path: ko/plugin-guide.md
status: M
grade_change: O
grade_full: R
review_state: auto
---

# Deploy / ko/plugin-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [변경분] | 64행 | 링크 라벨 `[API 2,1 가이드]`의 `2,1` 오타 | `[API v2.1 가이드]`(대상 페이지 제목 기준)
- [기존] | 45·49·53·59·135·202행 | 본문 이미지 6건 `http://static.toastoven.net/...` 비보안 링크 | `https://`로 교정
- [기존] | 138행 | `비활성화하고 싶을때` | `비활성화하고 싶을 때`(띄어쓰기)
- [기존] | 전체 | 문서 전반 불릿 기호 `*` | `-`로 통일
- [참고] | 24행 | `배포/종료/재시작` 등 동작 의미 용어 | 기술적 사실 → stop/terminate 글로서리 미적용, 임의 변경 금지
- [참고] | 전체 | `application key`·`artifact id`·`binary group key`·`compression level` 등 | 플러그인 UI 정착 영문 라벨 → 한글화 강제하지 않음

## 참고
- 등급: ⓐ 변경분 = 수정 필요(링크 라벨 `2,1` 오타) / ⓑ 문서 전체 = 시급(이미지 `http://` 비보안 링크 6건)
- 6월 변경은 링크 라벨/URL 1행 교체. `2,1`은 `2.1` 오타이나 링크 자체는 정상 도달하여 R→O.
- 기존 이슈: 모든 본문 이미지 `http://` 비보안 링크(R), 띄어쓰기 1건, 불릿 `*`.
