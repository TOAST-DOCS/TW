---
service: notification-hub
path: ko/console-guide/send-a-message.md
status: M
grade_change: O
grade_full: R
review_state: auto
---

# notification-hub / ko/console-guide/send-a-message.md — 자동 검수 결과

> Claude 자동 검수 초안입니다. 담당 라이터가 항목을 검토·반영(`[x]` 체크)하고,
> 완료되면 상단 `review_state`를 `done`(검토 중이면 `reviewing`)으로 바꿔 주세요.

## 변경해야 할 항목
- [ ] [변경분] 457/463행 `080 수신거부번호`(붙여쓰기)가 SMS 324행·RCS 366행 `080 수신 거부 번호`(띄어쓰기)와 불일치 → 표기 통일
- [ ] [기존] 600행 `http://docs.toast.com/.../push-android/` → `https://docs.nhncloud.com/ko/nhncloud/ko/nhncloud-sdk/push-android/`(550행 동일 SDK 링크와 일치시킴)
- [ ] [기존] 612행 `http://docs.toast.com/.../push-ios/` → `https://docs.nhncloud.com/ko/nhncloud/ko/nhncloud-sdk/push-ios/`(551행 동일 SDK 링크와 일치시킴)
- [ ] [기존] 671행 `30 초` → `30초`(단위 붙임)
- [ ] [기존] 613행 `디렉토리` → `디렉터리`
- [ ] [기존] 394행 `조회하시기 바랍니다` → `조회하세요`
- [x] [변경분] 480행 `비즈니스폼` 붙여쓰기 — 룰셋 부합, 조치 불필요
- [ ] [참고] 6월 diff는 대부분 `<a id="...">` 앵커 삽입(영문 슬러그)이라 본문 검수 대상 아님; 실제 신규 본문은 브랜드 메시지 섹션
- [ ] [참고] 457/459행 `마수동`·`M/N/O` 타겟팅 유형은 콘솔 정착 표기일 수 있어 표기 임의 변경 보류 — 작성자 확인

## 참고
- 등급: ⓐ 변경분 = 수정 필요(080 수신거부번호 표기 불일치, 🟠) / ⓑ 문서 전체 = 시급(`http://`+구 docs.toast.com 링크 2건, 🔴)
- 600/612행 링크는 WebFetch로 도달 확인: `http://docs.toast.com/.../push-android/`는 `docs.nhncloud.com`으로 301 리다이렉트되나 구 `/TOAST/` 경로를 유지 → 문서 내 550/551행이 쓰는 현행 `/nhncloud/ko/nhncloud-sdk/` 경로로 교체 권장.
- 신규 브랜드 메시지 섹션(435~481행)·공용 알림톡 안내(431행)는 기술 내용·용어상 문제 없음.
