## 아래 템플릿에 내용을 적어주세요.

```
글 제목: 양자 시대를 대비하는 개발자의 암호학 가이드(PQC-ML-KEM)
소속 부서: 앱서비스보안팀
작성자 이름: 정원희
작성자 소개글: NHN Cloud에서 NHN AppGuard(iOS)와 Windows Desktop Application을 개발하고 있습니다.
```

## <span style="color: rgb(37, 99, 235);">1\.</span> 들어가며

현재 웹 통신의 대부분은 HTTPS 프로토콜을 사용하고 있습니다. HTTPS는 TLS 위에서 동작하며, 주로 RSA나 ECDH 알고리즘으로 키를 교환하고 AES로 데이터를 암호화합니다. 과거 HTTP 시절에는 데이터가 평문으로 전송됐지만, 지금은 중간에서 패킷을 가로채더라도 내용을 알 수 없습니다. 도청은 사실상 불가능하다고 알려져 있습니다.

그런데 지금 이 순간에도 누군가는 이 복호화할 수 없는 암호화된 트래픽을 수집하고 있습니다. 왜 못 푸는 데이터를 모을까요?

> "Harvest Now, Decrypt Later"

지금 수집하고, 나중에 복호화한다는 의미로, 보안 업계에서 새로운 위협으로 대두되고 있습니다. 그렇다면 나중은 과연 언제일까요? 양자 컴퓨터의 실용화 시점입니다. 기존 RSA, ECDH 방식은 큰 수의 소인수분해나 이산로그 문제가 어렵다는 전제 위에 서 있는데, 양자 컴퓨터에서 [Shor 알고리즘](https://ko.wikipedia.org/wiki/%EC%87%BC%EC%96%B4_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)을 돌리면 이 문제들이 빠른 시간 내에 풀립니다. 단순히 키 길이를 늘리는 것만으로는 해결되지 않습니다.

NIST(미국 국립표준기술연구소)는 2016년부터 이 문제를 대비해왔고, 2024년 8월에 최종 표준 세 건을 확정했습니다. ML-KEM(FIPS 203), ML-DSA(FIPS 204), SLH-DSA(FIPS 205)입니다. 이 글에서는 그 중 키 캡슐화 메커니즘인 ML-KEM을 정리합니다.

## <span style="color: rgb(37, 99, 235);">2\.</span> 현재 암호의 문제

### 우리가 매일 쓰는 암호의 정체

매일 `https://`로 시작하는 사이트에 접속할 때, 뒤에서는 대략 이런 일이 벌어집니다.

```
[브라우저] <---TLS 핸드셰이크---> [서버]
```

이 핸드셰이크 과정에서 <span style="color: rgb(15, 23, 42);">비대칭 암호(공개키 암호)</span>가 사용됩니다. 대표적인 것들을 살펴보면 다음과 같습니다.

* <span style="color: rgb(15, 23, 42);">RSA</span>: 큰 수의 소인수분해가 <span style="color: rgb(15, 23, 42);">어렵다</span>는 점에 기반
* <span style="color: rgb(15, 23, 42);">ECDH/ECDSA</span>: 타원곡선 위의 이산로그 문제가 <span style="color: rgb(15, 23, 42);">어렵다</span>는 점에 기반
* <span style="color: rgb(15, 23, 42);">Diffie-Hellman</span>: 이산로그 문제가 <span style="color: rgb(15, 23, 42);">어렵다</span>는 점에 기반

여기서 핵심 키워드는 <span style="color: rgb(15, 23, 42);">"어렵다"</span>입니다. "불가능하다"가 아니라 "<span style="color: rgb(15, 23, 42);">어렵다</span>"입니다. 기존 컴퓨터로 RSA-2048을 깨려면 우주의 나이보다 긴 시간이 걸리기 때문에, 우리는 그동안 안심하고 이 알고리즘들을 사용해왔습니다.

하지만 <span style="color: rgb(15, 23, 42);">양자 컴퓨터는 다릅니다.</span>

### RSA가 깨지는 시나리오

#### ![Inline-image-2026-07-13 13.35.44.661.png](/files/4375609888025327569)

## <span style="color: rgb(37, 99, 235);">3\.</span> 양자 컴퓨터

![](https://whatsup.nhnent.com/owfs/read/284627/03ec6487-c584-4b79-ad76-cbce334837a4)

<span style="color: rgb(30, 41, 59);">(</span>Source: [<span style="color: rgb(30, 41, 59);">https://blog.google/innovation-and-ai/technology/research/google-willow-quantum-chip/</span>](https://whatsup.nhnent.com/cl/board/view/2740/undefined)<span style="color: rgb(30, 41, 59);">)</span>

### "비트" 대신 "큐비트"를 쓴다?

현재 우리가 쓰고 있는 컴퓨터의 비트는 0 아니면 1입니다. 그런데 양자 컴퓨터의 큐비트(qubit)는 <span style="color: rgb(15, 23, 42);">0과 1을 동시에</span> 가질 수 있습니다. 이걸 <span style="color: rgb(15, 23, 42);">중첩</span>이라고 합니다. 이해하기 쉽게 미로로 비유를 들어보겠습니다.

> <span style="color: rgb(15, 23, 42);">고전 컴퓨터</span>: 갈림길에서 한쪽을 골라 가봅니다. 막다른 길이면 돌아와서 다른 길을 갑니다.
>
> <span style="color: rgb(15, 23, 42);">양자 컴퓨터</span>: 갈림길에서 <span style="color: rgb(15, 23, 42);">분신술</span>을 씁니다. 모든 경로를 동시에 탐색합니다. 그리고 출구를 찾은 분신만 남깁니다.

이것이 양자 컴퓨터의 위력입니다.

### 쇼어(Shor) 알고리즘 — RSA의 천적

1994년, 수학자 피터 쇼어(Peter Shor)는 양자 컴퓨터를 이용하면 <span style="color: rgb(15, 23, 42);">소인수분해와 이산로그 문제를 다항식 시간에 풀 수 있다</span>는 알고리즘을 발표했습니다.

| 문제 | 고전 컴퓨터 | 양자 컴퓨터 (쇼어 알고리즘) |
| :--- | :----- | :--------------- |
| 소인수분해 (RSA) | 지수 시간 | <span style="color: rgb(15, 23, 42);">다항식 시간</span> |
| 이산로그 (DH, ECDH) | 지수 시간 | <span style="color: rgb(15, 23, 42);">다항식 시간</span> |

<span style="color: rgb(15, 23, 42);">"지수 시간 → 다항식 시간"</span>이라는 건 <span style="color: rgb(15, 23, 42);">"우주 나이만큼 걸리던 것이 몇 시간이면 된다"</span> 수준의 변화입니다. 양자 컴퓨터가 충분히 크고 안정적으로 만들어지면 — 이를 <span style="color: rgb(15, 23, 42);">CRQC</span>(Cryptographically Relevant Quantum Computer, 암호학적으로 의미있는 양자컴퓨터)라고 부릅니다 — RSA, ECDH, ECDSA 같은 <span style="color: rgb(15, 23, 42);">현재의 공개키 암호 체계가 뚫릴 수 있습니다.</span>

## <span style="color: rgb(37, 99, 235);">4\.</span> PQC란 무엇인가

### Post-Quantum Cryptography = 포스트 양자 암호

PQC는 <span style="color: rgb(15, 23, 42);">양자 컴퓨터가 등장한 이후에도 안전한 암호 알고리즘</span>을 말합니다. 한 가지 흔한 오해를 짚고 넘어가자면, PQC는 양자 컴퓨터 <span style="color: rgb(15, 23, 42);">위에서</span> 돌아가는 암호가 아닙니다. <span style="color: rgb(15, 23, 42);">일반 컴퓨터에서 돌아가면서, 양자 컴퓨터의 공격에도 강한 암호</span>입니다.

그렇다면 양자 컴퓨터도 풀기 어려운 암호는 어떻게 만들 수 있을까요? 쇼어 알고리즘이 잘 푸는 문제(소인수분해, 이산로그)와 <span style="color: rgb(15, 23, 42);">다른 종류의 수학 문제</span>에 기반한 암호를 만들면 됩니다.

### NIST PQC 표준화 — 8년간의 대장정

<br>

<strong><span style="color: rgb(37, 99, 235);">2016년</span></strong> PQC 공모 시작

<strong><span style="color: rgb(37, 99, 235);">2017년</span></strong> 69개 후보 알고리즘 제출

<strong><span style="color: rgb(37, 99, 235);">2019년</span></strong> Round 2 — 26개로 축소

<strong><span style="color: rgb(37, 99, 235);">2020년</span></strong> Round 3 — 7개 최종후보 + 8개 대안

<strong><span style="color: rgb(37, 99, 235);">2022년</span></strong> 1차 표준 선정 (Kyber, Dilithium, SPHINCS+, Falcon)

<strong><span style="color: rgb(37, 99, 235);">2024년 8월</span></strong> <span style="color: rgb(15, 23, 42);">FIPS 203/204/205 최종 발표!</span> — ML-KEM, ML-DSA, SLH-DSA

<strong><span style="color: rgb(37, 99, 235);">2025년 3월</span></strong> HQC 추가 선정 (백업 KEM)

<br>

2016년에 시작해서 2024년에 최종 발표까지 무려 <span style="color: rgb(15, 23, 42);">8년</span>이 걸렸습니다. 아래는 전 세계 암호학자들이 제출한 69개 후보 알고리즘 중에서 검증을 거쳐 최종 표준으로 선정된 알고리즘입니다.

<table><colgroup><col><col><col><col><col></colgroup><tr><th>

표준

</th><th>

알고리즘

</th><th>

원래 이름

</th><th>

용도

</th><th>

기반 수학

</th></tr><tr><td style="background-color: rgb(219, 234, 254)">

<span style="color: rgb(15, 23, 42);">FIPS 203</span>

</td><td style="background-color: rgb(219, 234, 254)">

<span style="color: rgb(15, 23, 42);">ML-KEM</span>

</td><td style="background-color: rgb(219, 234, 254)">

CRYSTALS-Kyber

</td><td style="background-color: rgb(219, 234, 254)">

키 캡슐화 (키 교환)

</td><td style="background-color: rgb(219, 234, 254)">

격자 (Module-LWE)

</td></tr><tr><td>

FIPS 204

</td><td>

ML-DSA

</td><td>

CRYSTALS-Dilithium

</td><td>

전자서명

</td><td>

격자 (Module-LWE/SIS)

</td></tr><tr><td>

FIPS 205

</td><td>

SLH-DSA

</td><td>

SPHINCS+

</td><td>

전자서명

</td><td>

해시

</td></tr></table>

이 글에서 집중적으로 다룰 것은 <span style="color: rgb(15, 23, 42);">ML-KEM</span>입니다. <span style="color: rgb(15, 23, 42);">키 교환이 뚫리면 나머지 보안은 다 무의미</span>하기 때문입니다. 자물쇠(대칭키 암호)가 아무리 튼튼해도, 열쇠를 전달하는 과정(키 교환)이 뚫리면 끝입니다.

## <span style="color: rgb(37, 99, 235);">5\.</span> 격자 기반 암호

![](https://whatsup.nhnent.com/owfs/read/284628/573baf99-21af-41d3-8450-564655aa5aba)

(Source: [https://research.ibm.com/projects/lattice-based-cryptography](https://whatsup.nhnent.com/cl/board/view/2740/undefined))

<br>

### 격자(Lattice)?

![Inline-image-2026-07-13 13.38.52.930.png](/files/4375611467281488514)

바둑판의 교차점들을 생각하시면 됩니다. 다만 실제 암호에서는 이게 2차원이 아니라 256차원, 512차원으로 올라갑니다.

### 격자 위의 어려운 문제들

격자 위에는 고전 컴퓨터로도, <span style="color: rgb(15, 23, 42);">양자 컴퓨터로도 풀기 어렵다고 여겨지는</span> 문제들이 있습니다.

#### 1\) SVP (Shortest Vector Problem, 최단 벡터 문제)

> "이 격자에서 원점과 가장 가까운 격자점을 찾아라."

2차원에서는 눈으로도 찾을 수 있지만, 256차원에서는 어떤 알고리즘으로도 효율적으로 풀 수 없습니다.

#### 2\) CVP (Closest Vector Problem, 최근 벡터 문제)

> "격자 위에 있지 않은 임의의 점이 주어졌을 때, 이 점과 가장 가까운 격자점을 찾아라."

이것도 마찬가지로, 고차원에서는 사실상 풀 수 없습니다. 이러한 문제들의 난해함이 바로 격자 기반 암호가 양자 내성(quantum-resistant)을 가지는 이유입니다.

## <span style="color: rgb(37, 99, 235);">6\.</span> LWE 문제

### Learning With Errors — "에러가 섞인 연립방정식"

ML-KEM의 보안은 <span style="color: rgb(15, 23, 42);">MLWE (Module Learning With Errors)</span> 문제의 어려움에 기반합니다. MLWE를 이해하기 위해 먼저 LWE부터 살펴보겠습니다.

#### 먼저, 에러가 없는 세계

중학교 수준의 연립방정식을 떠올려 볼 수 있습니다.

```
3x + 2y = 13
5x + 4y = 23
```

x=3, y=2라는 것을 금방 풀 수 있고, 컴퓨터는 더 빨리 풀 수 있을 것입니다.

#### 이제, 에러를 추가합니다

같은 연립방정식에 <span style="color: rgb(15, 23, 42);">작은 에러</span>를 추가해봅니다.

```
3x + 2y ≈ 13  (실제로는 3x + 2y + e₁ = 14, 에러 e₁ = 1)
5x + 4y ≈ 23  (실제로는 5x + 4y + e₂ = 22, 에러 e₂ = -1)
```

위 식에서도 에러가 1이나 -1이라는 것을 쉽게 알 수 있습니다. 하지만 이게 <span style="color: rgb(15, 23, 42);">변수 256개, 방정식 수백 개</span>이고 에러가 여기저기 흩어져 있다면 이야기가 완전히 달라집니다. 에러들이 연산할 때마다 누적되고 섞이면서, <span style="color: rgb(15, 23, 42);">원래 답을 복원하는 것이 사실상 불가능</span>해집니다.

#### ![Inline-image-2026-07-13 13.39.38.790.png](/files/4375611852060212176)

이 <span style="color: rgb(15, 23, 42);">"못 푸는 성질"</span>이 바로 ML-KEM의 보안 기반입니다.

### LWE를 수식으로 정리하면

| 기호 | 의미 |
| :--- | :--- |
| <span style="color: rgb(15, 23, 42);">A</span> | 공개 행렬 (m × n, 랜덤) |
| <span style="color: rgb(15, 23, 42);">s</span> | 비밀 벡터 (n × 1) ← 이걸 모르면 해독 불가 |
| <span style="color: rgb(15, 23, 42);">e</span> | 에러 벡터 (m × 1, 작은 값) |
| <span style="color: rgb(15, 23, 42);">b</span> | 공개 벡터 = A·s + e |
| <span style="color: rgb(15, 23, 42);">q</span> | 모듈러스 (모든 연산은 mod q) |

<span style="color: rgb(15, 23, 42);">LWE 문제</span>: (A, b)가 주어졌을 때, 비밀 벡터 s를 찾아라.

> b = A·s + e (mod q)

공격자는 (A, b)만 보고 s를 찾아야 합니다. 그런데 중간에 오차 e가 섞여 있어서 정확한 연립방정식이 아니기 때문에, 그냥 선형대수로는 풀기 어렵습니다.

## <span style="color: rgb(37, 99, 235);">7\.</span> ML-KEM 완전정복

![](https://whatsup.nhnent.com/owfs/read/284626/88be8f52-7dc1-4f55-8dff-332fdce973f0)

<span style="color: rgb(30, 41, 59);">(</span>Source: [<span style="color: rgb(30, 41, 59);">https://kivicore.com/en/embedded-security-blog/quantum-safe-key-exchange-for-secure-embedded-hardware-ml-kem-explained</span>](https://whatsup.nhnent.com/cl/board/view/2740/undefined))

### KEM — Key Encapsulation Mechanism

KEM은 <span style="color: rgb(15, 23, 42);">키 캡슐화 메커니즘</span>입니다. 기존의 키 교환 방식과는 접근 자체가 다릅니다.

<span style="color: rgb(15, 23, 42);">Diffie-Hellman (기존 키 교환)</span>:

> 양쪽이 각자 비밀값을 정하고, 공개값을 교환하여, 같은 비밀키를 "합의"합니다.

<span style="color: rgb(15, 23, 42);">KEM (키 캡슐화)</span>:

> 한쪽(Bob)이 상대방(Alice)의 공개키로 비밀키를 "캡슐에 넣어(encapsulate)" 보냅니다. Alice는 자기 개인키로 캡슐을 "열어(decapsulate)" 비밀키를 꺼냅니다.

### ML-KEM의 세 가지 알고리즘

ML-KEM은 세 가지 알고리즘으로 구성됩니다.

<img src="https://whatsup.nhnent.com/owfs/read/284634/ac4c431c-dfab-41ce-b644-29cbee92d2d0" alt="" width="740" />

﻿

Bob이 Encaps를 호출하면 알고리즘이 공유 비밀키 K와 암호문 c를 생성합니다. Bob은 K를 보관하고, c를 Alice에게 전달합니다. Alice는 자신의 개인키로 c를 역캡슐화하여 동일한 K를 얻게 되고, 이후 양쪽은 이 K를 대칭키로 사용하여 실제 데이터를 암복호화합니다.

## <span style="color: rgb(37, 99, 235);">8\.</span> ML-KEM 파라미터

### 세 가지 보안 수준

ML-KEM은 용도와 보안 요구 수준에 따라 세 가지 파라미터 셋을 제공합니다.

![Inline-image-2026-07-13 13.42.10.451.png](/files/4375613124892972123)

### 기존 암호와 크기 비교

ML-KEM의 공개키 크기가 기존보다 큰 것은 사실입니다. ML-KEM-768의 경우 1,184바이트로, 기존 공개키와 비교하면 다음과 같습니다.

<table><colgroup><col><col><col></colgroup><tr><th>

알고리즘

</th><th>

공개키 크기

</th><th>

비고

</th></tr><tr><td>

X25519 (ECDH)

</td><td>

32 바이트

</td><td>

현재 TLS의 표준

</td></tr><tr><td>

RSA-2048

</td><td>

256 바이트

</td><td>

<br>

</td></tr><tr><td>

RSA-4096

</td><td>

512 바이트

</td><td>

<br>

</td></tr><tr><td style="background-color: rgb(219, 234, 254)">

<span style="color: rgb(15, 23, 42);">ML-KEM-768</span>

</td><td style="background-color: rgb(219, 234, 254)">

<span style="color: rgb(15, 23, 42);">1,184 바이트</span>

</td><td style="background-color: rgb(219, 234, 254)">

<br>

</td></tr></table>

X25519보다는 약 37배 크지만, <span style="color: rgb(15, 23, 42);">RSA-2048과 비교하면 약 5배</span> 수준에 불과합니다. 현대 네트워크 환경에서 1KB 정도의 차이는 실질적으로 큰 부담이 되지 않습니다.

## <span style="color: rgb(37, 99, 235);">9\.</span> 실전 적용

### "실제로 누가 쓰고 있을까?"

이론적인 이야기가 길었는데, 실제 적용 현황을 살펴보면 ML-KEM은 이미 다양한 곳에서 사용되고 있습니다.

#### ![Inline-image-2026-07-13 13.44.11.064.png](/files/4375614137282993270)

<span style="color: rgb(15, 23, 42);">Chrome 브라우저</span>는 이미 TLS 1.3 핸드셰이크에서 X25519+ML-KEM-768 하이브리드 키 교환을 사용하고 있습니다. <span style="color: rgb(15, 23, 42);">OpenSSH 9.9+</span>에서도 `mlkem768x25519-sha256` 하이브리드 키 교환을 지원하며, 설정 한 줄이면 바로 적용할 수 있습니다.

```
ssh -o KexAlgorithms=mlkem768x25519-sha256 user@host
```

클라우드 서비스 쪽에서는 <span style="color: rgb(15, 23, 42);">AWS</span>가 KMS, ACM, Secrets Manager 등 주요 서비스에서 ML-KEM 기반 PQ-TLS를 지원하고 있으며, <span style="color: rgb(15, 23, 42);">OpenSSL 3.5</span>도 ML-KEM, ML-DSA, SLH-DSA를 기본으로 지원하기 때문에 별도 라이브러리 설치 없이 바로 사용할 수 있습니다.

## <span style="color: rgb(37, 99, 235);">10\.</span> 하이브리드 모드

### 왜 ML-KEM만 쓰지 않고, 기존 알고리즘과 섞어 쓰나?

ML-KEM은 충분히 검증되었고 NIST가 표준으로 확정했습니다. 하지만 PQC 알고리즘은 역사가 약 8년으로, RSA나 ECDH에 비하면 아직 짧습니다. 아직 발견되지 않은 취약점이 존재할 가능성을 완전히 배제할 수는 없기 때문에, 현재는 기존의 검증된 알고리즘(X25519)과 ML-KEM을 <span style="color: rgb(15, 23, 42);">동시에 하이브리드로</span> 사용하는 방식이 권장되고 있습니다.

<img src="https://whatsup.nhnent.com/owfs/read/284633/e892cc11-cde3-44d8-a2b2-b4e1fcf631bc" alt="" width="740" />

하이브리드 사용의 핵심은 <span style="color: rgb(15, 23, 42);">둘 중 하나만 안전해도 전체가 안전하다는 것</span>입니다. 이를 "OR 보안"이라고 부릅니다.

![Inline-image-2026-07-13 13.45.01.136.png](/files/4375614555943116087)

* 양자 컴퓨터가 등장해서 X25519가 깨져도? → ML-KEM이 지켜줌
* ML-KEM에서 예상치 못한 취약점이 발견돼도? → X25519가 지켜줌

이것이 과도기에 권장되는 사용 방법입니다.

## <span style="color: rgb(37, 99, 235);">11\.</span> 개발자가 해야 할 일

당장 모든 시스템을 교체할 필요는 없습니다. 하지만 <span style="color: rgb(15, 23, 42);">준비는 지금 시작해야</span> 합니다.

#### 1단계 — 인벤토리 파악

내 시스템에서 RSA, ECDH, DH를 어디에 쓰고 있는지 목록화 (TLS, SSH, JWT, API 키 교환 등)

#### 2단계 — 테스트 환경 구축

liboqs, OpenSSL 3.5 등으로 ML-KEM 테스트 환경 셋업. 키 크기 증가에 따른 영향 측정

#### 3단계 — 하이브리드 모드 도입

X25519 + ML-KEM-768 하이브리드 TLS 적용 (내부 시스템 먼저). 성능 모니터링

#### 4단계 — 점진적 확대

외부 서비스까지 확대. P50/P95/P99 레이턴시 모니터링. 문제 없으면 100% 적용

#### 5단계 — 순수 PQC로 전환

하이브리드 → PQC Only (업계 전체 전환 완료 후)

### 실용적 팁

#### 1\) 라이브러리 버전 확인

가장 먼저 할 수 있는 일은 현재 사용 중인 라이브러리가 ML-KEM을 지원하는지 확인하는 것입니다.

```
# OpenSSL 버전 확인
openssl version
# 3.5 이상이면 ML-KEM 지원

# Go 버전 확인
go version
# 1.24 이상이면 crypto/mlkem 패키지 사용 가능

# OpenSSH 버전 확인
ssh -V
# 9.9 이상이면 ML-KEM 하이브리드 KEX 지원
```

#### 2\) AWS 사용자라면

SDK를 최신 버전으로 업데이트하고 `postQuantumTlsEnabled(true)` 한 줄만 추가하면 됩니다. AWS-LC 라이브러리가 FIPS 140-3 인증을 받았으므로 규정 준수도 문제없습니다.

#### 3\) CBOM (Cryptographic Bill of Materials) 작성

어떤 암호 알고리즘이 어디에 쓰이는지 목록을 만들어 두면, 전환 계획을 수립하는 데 큰 도움이 됩니다. 아래는 예시입니다.

| 시스템 | 현재 알고리즘 | 전환 대상 |
| :--- | :------ | :---- |
| 웹서버 TLS | ECDHE-P256 | X25519+ML-KEM |
| SSH 접속 | curve25519 | mlkem768x25519 |
| JWT 서명 | RS256/ES256 | ML-DSA |
| 코드사이닝 | RSA-2048 | ML-DSA / SLH |
| DB 암호화 | AES-256 | AES-256 (유지) |

## <span style="color: rgb(37, 99, 235);">12\.</span> 정리

이 글에서 다룬 내용을 요약하면 다음과 같습니다.

* 양자 컴퓨터는 Shor 알고리즘으로 RSA, ECDH 등 현행 공개키 암호를 깰 수 있습니다.
* PQC(포스트 양자 암호)는 양자 컴퓨터로도 풀기 어려운 수학 문제(격자 문제)에 기반한 새로운 암호입니다.
* ML-KEM(FIPS 203)은 NIST가 표준화한 키 캡슐화 메커니즘으로, Module-LWE 문제의 어려움에 기반합니다.
* ML-KEM의 키 크기 증가는 실용적 범위 내입니다.
* 현재는 하이브리드 모드(X25519+ML-KEM-768)로 점진적 전환이 진행 중이며, Chrome, AWS, OpenSSH 등에서 이미 사용 가능합니다.
* "Harvest Now, Decrypt Later" 위협 때문에, 전환은 양자 컴퓨터 완성 전에 시작해야 합니다.

보안개발랩 앱서비스보안팀에서는 [Cloud Access](https://www.nhncloud.com/kr/service/security/cloud-access)를 개발하고 있습니다. Cloud Access는 제로 트러스트(Zero Trust) 보안 모델을 기반으로 NHN Cloud 리소스에 안전하게 접속할 수 있도록 지원하는 서비스입니다. 기존의 네트워크 경계에 의존하던 보안 방식에서 벗어나, 모든 접근을 검증하고 클라우드 리소스에 대한 접근을 중앙에서 통제합니다.

Cloud Access는 사용자 단말과 클라우드 리소스 사이에 암호화된 터널을 생성하여 통신을 보호하는데, 이 터널링 암호화 구간이 바로 PQC 전환의 핵심 대상입니다. 양자 컴퓨팅 위협에 선제적으로 대응하기 위해 Cloud Access의 터널링 암호화에 ML-KEM 기반 PQC를 적용하는 방안을 연구 중이며, 단계적으로 도입해 나갈 예정입니다.

긴 글 읽어 주셔서 감사합니다.

### 참고 자료

[NIST FIPS 203 — ML-KEM 표준 문서](https://csrc.nist.gov/pubs/fips/203/final)
[](https://csrc.nist.gov/pubs/fips/203/final)[NIST FIPS 204 — ML-DSA 표준 문서](https://csrc.nist.gov/pubs/fips/204/final)
[](https://csrc.nist.gov/pubs/fips/204/final)[NIST FIPS 205 — SLH-DSA 표준 문서](https://csrc.nist.gov/pubs/fips/205/final)
[](https://csrc.nist.gov/pubs/fips/205/final)[NIST PQC 표준화 프로젝트](https://csrc.nist.gov/projects/post-quantum-cryptography)
[](https://csrc.nist.gov/projects/post-quantum-cryptography)[AWS PQC 마이그레이션 가이드](https://aws.amazon.com/security/post-quantum-cryptography/)
[](https://aws.amazon.com/security/post-quantum-cryptography/)[Go ML-KEM 구현 해설 (Filippo Valsorda)](https://words.filippo.io/dispatches/mlkem768/)
[](https://words.filippo.io/dispatches/mlkem768/)[Open Quantum Safe (liboqs)](https://openquantumsafe.org/)
