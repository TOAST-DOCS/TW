---
service: Compute-Image
path: ko/public-api.md
status: M
grade_change: G
grade_full: R
review_state: auto
---

# Compute-Image / ko/public-api.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터(TW)가 각 항목의 타당성을 검토합니다.
> 실제 원본 문서 수정은 이후 개발자가 수행합니다.

## 변경해야 할 항목
- [기존] | 527행 | 본문 `memeber_status` 오타 | `member_status`
- [기존] | 776행 | Enum 값 `accpeted` 오타 | `accepted`
- [기존] | 770행 | 응답 표 헤더 `유형` | `형식`(다른 표와 통일)
- [기존] | 380~381행 | `</br>`(비표준 태그) | `<br>`
- [참고] | 31행 | `limit` 기본값 100→25·최대 1000 표기 삭제 | 기술적 사실 변화 → 작성자/API 사양 확인 필요
- [참고] | | 멤버(추가/목록/상태 변경)는 이미지 공유 테넌트 멤버 개념 | `IAM 계정` 변환 룰 미적용
- [참고] | 4행 | `Image은(는)` 자동 조사 표기 | NHN 문서 정착 형식 → 유지

## 참고
- 등급: ⓐ 변경분 = 통과(diff는 `limit` 기본값 변경 1건뿐, 용어·서식 문제 없음. 사실 검증은 [참고]로 분리) / ⓑ 문서 전체 = 시급(파라미터명·Enum 값 오타 2건 = 기술 오류 🔴)
- 행번호는 원문(content) 기준. 엔드포인트 URL은 모두 `https://`로 정상, 필수 섹션 누락 없음, 콘솔 경로 지적 없음.
