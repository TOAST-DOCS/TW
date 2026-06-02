# NHN Cloud 문서 검수 자동화 성과 보고

**대상 기간**: 2026년 4월~5월 배포분
**평가 기준**: `NHN_Cloud_Docs_Checklist.md` — 5개 영역 × 4개 항목 × 5점 척도 (100점 만점, N/A 항목은 만점에서 제외 후 100점 환산)
**작성일**: 2026-05-27

---

## 1. Executive Summary (한눈에 보기)

| 지표 | 값 |
|------|------|
| 평가 완료 문서 | **102건** |
| 평가 완료 서비스 | **24개** |
| 평균 점수 100점 환산 (원본 → 수정본) | **75.0 → 85.6점** |
| 평균 상승폭 | **+10.6점** |
| 평균 상승률 | **+14.2%** |
| 최대 상승폭 문서 | ROLE_5월 `release-notes` (+25점, **+36.4%**) |
| 가장 개선된 영역 | **3. 일관성 및 표준 준수** (+5.9점, **+46.6%**) |

> **핵심 메시지**
> 자동 검수가 가장 효과적인 영역은 **표기·서식 일관성**이며, 102건 전수에서 일관성 영역은 평균 12.6점 → 18.5점(**+46.6%**)으로 압도적으로 개선되었습니다. 가독성도 +19.4%로 큰 폭 향상되었으며, 자동화로 잡히지 않는 정확성·구조·시각 영역은 +3~5% 수준에 머물러 **작성자(개발자) 측 가이드/교육이 필요한 휴먼 영역**으로 명확히 분리됩니다.

---

## 2. 영역별 개선 효과 (자동화 임팩트의 형태)

| 영역 (20점 만점) | 평균 원본 | 평균 수정본 | 평균 상승폭 | 평균 상승률 |
|------|:---:|:---:|:---:|:---:|
| 1. 정확성 및 완전성 | 16.22 | 16.83 | +0.61 | +3.8% |
| 2. 가독성 및 명확성 | 14.27 | 17.04 | **+2.77** | **+19.4%** |
| **3. 일관성 및 표준 준수** | 12.61 | 18.48 | **+5.87** | **+46.6%** |
| 4. 구조 및 탐색 편의성 | 16.40 | 17.07 | +0.67 | +4.1% |
| 5. 시각 자료 및 예제 코드 | 14.87 | 15.55 | +0.68 | +4.6% |

> **해석**
> **자동 검수의 강점 (영역 3·2)**: 표기·서식 일관성과 가독성. 규칙 기반 패턴 매칭이 강한 영역.
> **자동 검수의 한계 (영역 1·4·5)**: 정확성·구조·시각. 문맥 이해와 도메인 지식이 필요한 영역으로 작성자(개발자)와 TW의 휴먼 판단에 의존.

---

## 3. Top 10 — 개선 임팩트가 가장 큰 문서

원본 품질이 낮을수록 자동화 검수 개선의 효과가 큽니다.

| 순위 | 서비스 | 월 | 문서 | 원본 → 수정본 | 상승폭 | 상승률 |
|:---:|------|:---:|------|:---:|:---:|:---:|
| 1 | ROLE | 5월 | `release-notes` | 68.8 → 93.8 | **+25.0** | **+36.4%** |
| 2 | Email | 3월 | `service-policy` | 72.5 → 92.5 | +20.0 | +27.6% |
| 3 | Compute | 5월 | `component-guide-gov` | 69.0 → 88.0 | +19.0 | +27.5% |
| 4 | Email | 3월 | `release-notes` | 73.3 → 92.2 | +18.9 | +25.8% |
| 5 | NAS | 5월 | `console-guide` | 74.4 → 93.3 | +18.9 | +25.4% |
| 6 | Email | 5월 | `release-notes` | 72.5 → 91.3 | +18.8 | +25.9% |
| 7 | Image Builder | 4월 | `component-guide-gov` | 63.0 → 81.0 | +18.0 | +28.6% |
| 8 | KakaoTalk Bizmessage | 4월 | `friendtalkupgrade-console-guide` | 66.0 → 84.0 | +18.0 | +27.3% |
| 9 | Compute | 5월 | `component-guide` 외 5개 변종 (일반/ncgn/ngoic/ngovc/ngsc/ninc) | 70.0 → 88.0 | +18.0 | +25.7% |
| 10 | Object Storage | 5월 | `release-notes` | 73.3 → 91.1 | +17.8 | +24.2% |

---

## 4. Top 10 — 개발자가 가장 자주 범하는 오류 유형

102개 평가 파일의 "주요 개선 사항" 텍스트에서 키워드 출현 빈도 기준입니다. **상위 5개 패턴만 작성 시점에 사전 차단해도 평균 5~7점 상승**할 것으로 추정됩니다.

| 순위 | 오류 유형 | 등장 문서 수 | 대표 사례 |
|:---:|------|:---:|------|
| 1 | **용어 혼용·통일 누락** | **87 / 102 (85%)** | `자원↔리소스`, `종료/중지/정지`, `리턴↔반환`, `컬럼↔칼럼`, `appkey↔appKey`, 대소문자 혼용 |
| 2 | **번역투 표현** | 72 / 102 (71%) | `~에 대한`, `~하고자`, `~을 통해`, `혹은` |
| 3 | **띄어쓰기 오류** | 64 / 102 (63%) | `인스턴스간`, `설정파일`, `필수값`, `2가지의`, `토큰화할` |
| 4 | **단순 오타** | 36 / 102 (35%) | `INAVLID→INVALID`, `servfer.cnf→server.cnf`, `ConentType→ContentType` |
| 5 | **외래어 표기 오류** | 25 / 102 (25%) | `컨텐츠→콘텐츠`, `매뉴얼/메뉴얼`, 외래어 표기법 미준수 |
| 6 | **코드 텍스트 백틱 미적용** | 22 / 102 (22%) | HTTP 헤더·메서드·필드명·상수가 일반 텍스트로 작성됨 |
| 7 | **극존칭 어미** | 18 / 102 (18%) | `~하시기 바랍니다`, `~주십시오`, `~해 주세요` |
| 8 | **참고 표현 비통일** | 15 / 102 (15%) | `참고하시기 바랍니다`·`참고합니다` → `참고하세요` 통일 누락 |
| 9 | **볼드 과적용·말머리 볼드** | 14 / 102 (14%) | 타이틀·강조·설정값 설명 패턴의 불필요한 볼드, `[참고]/[주의]` 대괄호 말머리 볼드 |
| 10 | **점목록 ↔ 평문 변환 필요** | 12 / 102 (12%) | 단일 항목 점 목록 / 여러 항목인데 평문 — 점 목록 사용 기준(여러 항목 시) 미준수 |

> **참고**
> 이중 피동·사동 8%(`보여지`, `되어지`, `동작됩니다`), UI 경로명 변경(`고객 센터 > 1:1 문의 → 고객지원 > 문의하기`) 7%도 반복 출현. Lint 룰화 시 효과 큼.

---

## 5. 서비스별 품질 현황 (100점 환산, 상승폭 내림차순)

| 서비스 | 평가 문서 | 평균 원본 | 평균 수정본 | 평균 상승폭 | 평균 상승률 |
|------|:---:|:---:|:---:|:---:|:---:|
| Email | 4 | 73.6 | 91.8 | **+18.2** | **+24.7%** |
| ROLE | 3 | 71.3 | 89.2 | +17.9 | +25.1% |
| Compute | 10 | 71.4 | 87.1 | +15.7 | +22.0% |
| EasyCache | 1 | 74.0 | 89.0 | +15.0 | +20.3% |
| Image Builder | 2 | 61.5 | 76.0 | +14.5 | +23.6% |
| OCR | 5 | 74.0 | 87.0 | +13.0 | +17.5% |
| NAS | 4 | 75.2 | 87.7 | +12.5 | +16.7% |
| CDN | 6 | 65.3 | 76.8 | +11.5 | +17.6% |
| DataFlow | 6 | 73.9 | 84.8 | +10.9 | +14.8% |
| RDS for MySQL | 4 | 73.5 | 84.3 | +10.8 | +14.6% |
| Cloud Monitoring | 6 | 80.0 | 90.5 | +10.5 | +13.1% |
| NAS for BigData | 3 | 78.0 | 88.3 | +10.3 | +13.2% |
| KakaoTalk Bizmessage | 5 | 73.7 | 84.0 | +10.2 | +13.9% |
| Cloud Scheduler | 1 | 79.0 | 89.0 | +10.0 | +12.7% |
| Notification Hub | 5 | 78.7 | 88.4 | +9.8 | +12.4% |
| Object Storage | 7 | 78.6 | 88.1 | +9.5 | +12.1% |
| DataQuery | 4 | 79.6 | 89.1 | +9.5 | +11.9% |
| Private CA | 1 | 79.0 | 88.0 | +9.0 | +11.4% |
| EasyQueue | 3 | 80.0 | 89.0 | +9.0 | +11.3% |
| Deploy | 8 | 75.4 | 82.6 | +7.3 | +9.6% |
| Cloud Functions | 2 | 82.8 | 88.4 | +5.7 | +6.8% |
| Certificate Manager | 4 | 74.8 | 79.3 | +4.5 | +6.0% |
| Pipeline | 5 | 77.2 | 81.4 | +4.3 | +5.5% |
| RDS for PostgreSQL | 3 | 76.3 | 79.7 | +3.3 | +4.4% |

> **인사이트**
> 원본 품질이 낮거나 갱신 빈도가 낮은 서비스(Email, ROLE, Compute, Image Builder)일수록 자동 검수의 ROI가 크게 나타납니다. 반대로 이미 품질이 안정화된 Pipeline·Cloud Functions·Deploy는 상승폭이 5% 내외로 정체 — 추가 개선은 영역 1·4·5의 휴먼 영역에서 가능.

---

## 6. 자동화로 잡히지 않는 영역 (작성자 책임 영역)

상승폭이 작은 영역(1·4·5)이 정체된 이유 — 즉 **자동 검수의 한계**입니다. 이 항목들은 작성 단계(개발자)에서 직접 보완이 필요합니다.

| 항목 | 정체 이유 | 대응 방안 |
|------|------|------|
| **예외 및 오류 처리** (항목 3) | 트러블슈팅 섹션 자체가 부재 | 작성 템플릿에 "주요 오류 코드/메시지" 섹션 의무화 |
| **도입부 제공** (항목 14) | "이 가이드로 무엇을 할 수 있는가" 1~2줄 누락 | 문서 상단 표준 도입부 패턴 정의 |
| **선행 조건 명시** (항목 2) | IAM 권한·사전 활성화 등 누락 | "사전 준비 사항" 블록 템플릿 도입 |
| **이미지 alt text 적정성** (항목 18) | 캡션·alt 불일치, 영한 혼용(`context 메뉴`) | 이미지 추가 시 alt 작성 체크 |
| **콘솔 스크린샷 최신화** (항목 17) | 일부 이미지가 1~2년 전 콘솔 기준 | 분기별 스크린샷 일괄 갱신 사이클 |
| **전문 용어 해설** (항목 8) | PEM·HA·CIDR 등 약어 첫 등장 시 풀이 부족 | 글로서리 자동 링크 / 약어 사전 확장 |

---

## 7. 부록 — 평가 완료 102개 문서 점수표 (100점 환산)

| 서비스 | 월 | 문서 | 만점 | 원본 | 수정본 | 상승폭 | 상승률 |
|------|:---:|------|:---:|:---:|:---:|:---:|:---:|
| CDN | 4월 | api-guide-v2.0 | 100 | 64 | 78 | +14.0 | +21.9% |
| CDN | 4월 | api-guide-v2.0-gov | 100 | 64 | 78 | +14.0 | +21.9% |
| CDN | 4월 | console-guide | 100 | 66 | 78 | +12.0 | +18.2% |
| CDN | 4월 | console-guide-gov | 100 | 66 | 78 | +12.0 | +18.2% |
| CDN | 4월 | release-notes | 100 | 67 | 74 | +7.0 | +10.4% |
| CDN | 4월 | release-notes-gov | 100 | 65 | 75 | +10.0 | +15.4% |
| Certificate Manager | 4월 | api-guide-v1.1 | 100 | 76 | 79 | +3.0 | +3.9% |
| Certificate Manager | 4월 | api-guide-v1.1-gov | 100 | 76 | 79 | +3.0 | +3.9% |
| Certificate Manager | 4월 | release-notes | 100 | 76 | 84 | +8.0 | +10.5% |
| Certificate Manager | 4월 | release-notes-gov | 100 | 71 | 75 | +4.0 | +5.6% |
| Cloud Functions | 4월 | api-guide-v1-0 | 90† | 77 | 79 | +2.2 | +2.6% |
| Cloud Functions | 4월 | release-notes | 55† | 44 | 49 | +9.1 | +11.4% |
| Cloud Monitoring | 4월 | console-guide | 100 | 77 | 90 | +13.0 | +16.9% |
| Cloud Monitoring | 4월 | console-guide-gov | 100 | 77 | 90 | +13.0 | +16.9% |
| Cloud Monitoring | 4월 | console-guide-ncgn | 100 | 77 | 90 | +13.0 | +16.9% |
| Cloud Monitoring | 4월 | release-notes | 100 | 83 | 91 | +8.0 | +9.6% |
| Cloud Monitoring | 4월 | release-notes-gov | 100 | 82 | 91 | +9.0 | +11.0% |
| Cloud Monitoring | 4월 | release-notes-ncgn | 100 | 84 | 91 | +7.0 | +8.3% |
| Cloud Scheduler | 4월 | release-notes | 100 | 79 | 89 | +10.0 | +12.7% |
| Compute | 5월 | component-guide | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | component-guide-gov | 100 | 69 | 88 | +19.0 | +27.5% |
| Compute | 5월 | component-guide-ncgn | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | component-guide-ngoic | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | component-guide-ngovc | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | component-guide-ngsc | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | component-guide-ninc | 100 | 70 | 88 | +18.0 | +25.7% |
| Compute | 5월 | release-notes | 100 | 75 | 85 | +10.0 | +13.3% |
| Compute | 5월 | release-notes-gov | 100 | 75 | 85 | +10.0 | +13.3% |
| Compute | 5월 | release-notes-ncgn | 100 | 75 | 85 | +10.0 | +13.3% |
| DataFlow | 4월 | console-user-guide | 100 | 69 | 77 | +8.0 | +11.6% |
| DataFlow | 4월 | node-config-guide | 100 | 68 | 84 | +16.0 | +23.5% |
| DataFlow | 4월 | release-notes | 100 | 70 | 85 | +15.0 | +21.4% |
| DataFlow | 5월 | error-code | 100 | 66 | 69 | +3.0 | +4.5% |
| DataFlow | 5월 | node-config-guide | 100 | 70 | 77 | +7.0 | +10.0% |
| DataFlow | 5월 | release-notes | 100 | 61 | 73 | +12.0 | +19.7% |
| DataQuery | 4월 | console-user-guide | 100 | 81 | 89 | +8.0 | +9.9% |
| DataQuery | 4월 | release-notes | 100 | 82 | 91 | +9.0 | +11.0% |
| DataQuery | 5월 | console-user-guide | 100 | 69 | 80 | +11.0 | +15.9% |
| DataQuery | 5월 | release-notes | 100 | 63 | 70 | +7.0 | +11.1% |
| Deploy | 4월 | api-guide | 100 | 73 | 81 | +8.0 | +11.0% |
| Deploy | 4월 | api-guide-v1.0 | 100 | 72 | 80 | +8.0 | +11.1% |
| Deploy | 4월 | api-guide-v1.0-gov | 100 | 72 | 80 | +8.0 | +11.1% |
| Deploy | 4월 | api-guide-v2.0 | 100 | 80 | 84 | +4.0 | +5.0% |
| Deploy | 4월 | api-guide-v2.1 | 100 | 79 | 87 | +8.0 | +10.1% |
| Deploy | 4월 | api-guide-v2.1-gov | 100 | 79 | 87 | +8.0 | +10.1% |
| Deploy | 4월 | release-notes | 100 | 73 | 81 | +8.0 | +11.0% |
| Deploy | 4월 | release-notes-gov | 100 | 75 | 81 | +6.0 | +8.0% |
| EasyCache | 5월 | release-notes | 100 | 74 | 89 | +15.0 | +20.3% |
| EasyQueue | 4월 | kafka-client-guide | 100 | 72 | 88 | +16.0 | +22.2% |
| EasyQueue | 5월 | console-guide | 100 | 79 | 86 | +7.0 | +8.9% |
| EasyQueue | 5월 | kafka-client-guide | 100 | 89 | 93 | +4.0 | +4.5% |
| Email | 3월 | release-notes | 90† | 66 | 83 | +18.9 | +25.8% |
| Email | 3월 | service-policy | 80† | 58 | 74 | +20.0 | +27.6% |
| Email | 5월 | release-notes | 80† | 58 | 73 | +18.8 | +25.9% |
| Email | 5월 | service-policy | 80† | 61 | 73 | +15.0 | +19.7% |
| Image Builder | 4월 | component-guide | 100 | 60 | 71 | +11.0 | +18.3% |
| Image Builder | 4월 | component-guide-gov | 100 | 63 | 81 | +18.0 | +28.6% |
| KakaoTalk Bizmessage | 4월 | friendtalkupgrade-api-guide | 100 | 69 | 81 | +12.0 | +17.4% |
| KakaoTalk Bizmessage | 4월 | friendtalkupgrade-console-guide | 100 | 66 | 84 | +18.0 | +27.3% |
| KakaoTalk Bizmessage | 4월 | release-notes | 100 | 78 | 87 | +9.0 | +11.5% |
| KakaoTalk Bizmessage | 5월 | common-api-guide | 100 | 71 | 75 | +4.0 | +5.6% |
| KakaoTalk Bizmessage | 5월 | friendtalkupgrade-api-guide | 100 | 69 | 76 | +7.0 | +10.1% |
| NAS | 5월 | api-guide | 100 | 68 | 77 | +9.0 | +13.2% |
| NAS | 5월 | console-guide | 100 | 67 | 84 | +17.0 | +25.4% |
| NAS | 5월 | release-notes | 100 | 61 | 70 | +9.0 | +14.8% |
| NAS | 5월 | terraform-guide | 100 | 67 | 76 | +9.0 | +13.4% |
| NAS for BigData | 5월 | console-guide | 100 | 70 | 81 | +11.0 | +15.7% |
| NAS for BigData | 5월 | overview | 100 | 62 | 71 | +9.0 | +14.5% |
| NAS for BigData | 5월 | release-notes | 100 | 63 | 69 | +6.0 | +9.5% |
| Notification Hub | 5월 | contact-delivery-result | 100 | 74 | 79 | +5.0 | +6.8% |
| Notification Hub | 5월 | kakao-statistics | 100 | 74 | 78 | +4.0 | +5.4% |
| Notification Hub | 5월 | message | 100 | 67 | 81 | +14.0 | +20.9% |
| Notification Hub | 5월 | stats | 100 | 73 | 79 | +6.0 | +8.2% |
| Notification Hub | 5월 | template | 100 | 66 | 81 | +15.0 | +22.7% |
| OCR | 5월 | document-ocr-api-guide-v2.0 | 100 | 72 | 86 | +14.0 | +19.4% |
| OCR | 5월 | document-ocr-api-guide-v2.1 | 100 | 72 | 86 | +14.0 | +19.4% |
| OCR | 5월 | document-ocr-console-guide | 100 | 73 | 85 | +12.0 | +16.4% |
| OCR | 5월 | document-ocr-release-notes | 90† | 72 | 79 | +7.8 | +9.7% |
| OCR | 5월 | overview | 100 | 73 | 90 | +17.0 | +23.3% |
| Object Storage | 5월 | api-guide | 90† | 72 | 79 | +7.8 | +9.7% |
| Object Storage | 5월 | cli-guide | 90† | 73 | 77 | +4.4 | +5.5% |
| Object Storage | 5월 | console-guide | 100 | 72 | 79 | +7.0 | +9.7% |
| Object Storage | 5월 | container-policy-guide | 90† | 76 | 78 | +2.2 | +2.6% |
| Object Storage | 5월 | release-notes | 90† | 66 | 82 | +17.8 | +24.2% |
| Object Storage | 5월 | s3-api-guide | 90† | 66 | 78 | +13.3 | +18.2% |
| Object Storage | 5월 | third-party-tools-guide | 90† | 70 | 82 | +13.3 | +17.1% |
| Pipeline | 4월 | api-guide-gov-v1-0 | 90† | 70 | 73 | +3.3 | +4.3% |
| Pipeline | 4월 | api-guide-gov-v1-1 | 90† | 69 | 72 | +3.3 | +4.3% |
| Pipeline | 4월 | api-guide-v1-1 | 90† | 69 | 72 | +3.3 | +4.3% |
| Pipeline | 4월 | release-notes | 75† | 56 | 62 | +8.0 | +10.7% |
| Pipeline | 4월 | release-notes-gov | 60† | 48 | 50 | +3.3 | +4.2% |
| Private CA | 4월 | release-notes | 100 | 79 | 88 | +9.0 | +11.4% |
| RDS for MySQL | 5월 | api-guide-v4.0_template | 100 | 75 | 83 | +8.0 | +10.7% |
| RDS for MySQL | 5월 | db-engine_template | 100 | 69 | 82 | +13.0 | +18.8% |
| RDS for MySQL | 5월 | db-instance_template | 100 | 72 | 84 | +12.0 | +16.7% |
| RDS for MySQL | 5월 | release-notes | 100 | 78 | 88 | +10.0 | +12.8% |
| RDS for PostgreSQL | 4월 | db-instance | 100 | 77 | 80 | +3.0 | +3.9% |
| RDS for PostgreSQL | 4월 | event | 100 | 74 | 78 | +4.0 | +5.4% |
| RDS for PostgreSQL | 4월 | release-notes | 100 | 78 | 81 | +3.0 | +3.8% |
| ROLE | 5월 | api-v3-guide | 100 | 73 | 85 | +12.0 | +16.4% |
| ROLE | 5월 | release-notes | 80† | 55 | 75 | +25.0 | +36.4% |
| ROLE | 5월 | sdk-v2-guide | 100 | 65 | 80 | +15.0 | +23.1% |

> † 표시는 N/A 항목(이미지·alt text·코드 블록 등)을 만점에서 제외한 결과입니다. 상승폭/상승률은 모두 100점 환산 후 비교 가능한 값입니다.

---

> **데이터 출처**: `C:\Users\NHN\Documents\Claude\Result\<서비스>_<월>\<문서>_{score|eval|evaluation|checklist}.md` (총 102개 평가 파일)
> **평가 도구**: `C:\Users\NHN\Documents\Claude\Instruction\4_NHN_Cloud_Docs_Checklist.md` — 5점 척도 정량 평가 체크리스트
