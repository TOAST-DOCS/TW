---
service: Storage-Online-NAS
path: ko/terraform-guide.md
status: M
grade_change: G
grade_full: O
review_state: auto
---

# Storage-Online-NAS / ko/terraform-guide.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 49·58·65·173행 | `> [참고]` 인용 블록 | `!!! tip`(본문 4칸 들여쓰기)
- [기존] | 167행 | `> [주의]` 인용 블록 | `!!! danger`(본문 4칸 들여쓰기)
- [참고] | 60·66행 | `Storage > NAS > CIFS 인증 정보 관리`·`암호화 키 저장소 설정` 콘솔 경로 | 실측 권장(단정 불가)

## 참고
- 등급: ⓐ 변경분 = 통과 / ⓑ 문서 전체 = 수정 필요
- 6월 diff는 23행 한 줄(상호 참조 링크를 Compute/Instance→NHN Cloud 공통 가이드로 이전). 링크 형식·용어·조사·어미 정상이라 변경분은 G.
- 전체 스캔: 용어(스냅숏·오픈 소스)·단위(300GB·10,000GB·100GB·1,000)·외부 링크(`https://` 4건)·표/코드블록 구조 모두 정상. 노트 박스가 admonition이 아닌 `>` 인용으로 작성된 점만 서식 기존 이슈(O)라 ⓑ=O.
