# 경계가 만든 길, Load Balancer(DSR)

---

어느 오후, 평소처럼 서버 모니터링 대시보드를 열어 보았다. 요청 패킷 하나와 여유로운 CPU. 아무런 문제도 없어 보였다. 그런데 로드밸런서(LB)의 트래픽 그래프가 이상하였다. 요청과 응답이 같은 경로를 지나고 있었다.

접속자의 수가 증가할수록 LB의 처리량은 선형으로 치솟았다. 기존의 프록시 방식 LB는 클라이언트와 서버 사이에서 양쪽 연결을 모두 종단하고 데이터를 중계하는 구조였다. 요청이 작아도 응답이 큰 서비스라면, 그 응답 트래픽 전부가 LB를 통과했다. 1KB 요청에 100MB 응답이 나가는 워크로드라면 LB 대역폭을 응답이 다 잡아먹는 셈이었다. 100명일 때 초당 6천 회, 1,000명이 되면 6만 회. 그 수치는 가파르게 올라갔다.

백엔드 서버를 아무리 늘려도 LB 자체가 처리량의 상한이 되는 구조였다. 물론 기존의 프록시 방식은 L7 라우팅, SSL 종단이 필요한 표준 웹 서비스에서는 효율적이었다. 하지만 응답 트래픽이 크거나 낮은 레이턴시가 중요한 워크로드에서는 구조적인 한계가 분명했다.

어떻게 하면 이 한계에서 벗어날 수 있을까? 응답 트래픽을 LB에서 분리해, 서버가 클라이언트에게 직접 응답하게 되면 이 병목을 근본적으로 제거할 수 있겠다고 생각했다. 그것이 이 프로젝트의 출발점이었다.

---

## 어디에 선을 그을 것인가

<svg width="100%" viewBox="0 0 680 310" role="img">
  <title>프록시 방식 vs DSR 방식 비교</title>
  <desc>프록시 방식은 요청과 응답 모두 LB를 경유하고, DSR 방식은 요청만 LB를 경유하고 응답은 서버에서 클라이언트로 직접 전달된다.</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text font-size="14" font-weight="500" x="160" y="28" text-anchor="middle" fill="#1a1a1a">프록시 방식</text>
  <rect x="40" y="50" width="80" height="36" rx="6" fill="#f1efe8" stroke="#b4b2a9" stroke-width="0.5"/>
  <text font-size="12" x="80" y="68" text-anchor="middle" dominant-baseline="central" fill="#444">클라이언트</text>
  <rect x="155" y="50" width="90" height="36" rx="6" fill="#fcebeb" stroke="#e24b4a" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="200" y="62" text-anchor="middle" dominant-baseline="central" fill="#791f1f">LB</text>
  <text font-size="12" x="200" y="78" text-anchor="middle" dominant-baseline="central" fill="#a32d2d">모든 경유</text>
  <rect x="280" y="50" width="60" height="36" rx="6" fill="#f1efe8" stroke="#b4b2a9" stroke-width="0.5"/>
  <text font-size="12" x="310" y="68" text-anchor="middle" dominant-baseline="central" fill="#444">서버</text>
  <line x1="122" y1="60" x2="153" y2="60" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="247" y1="60" x2="278" y2="60" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text font-size="12" x="136" y="52" text-anchor="middle" fill="#555">요청</text>
  <line x1="278" y1="76" x2="247" y2="76" stroke="#e24b4a" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="153" y1="76" x2="122" y2="76" stroke="#e24b4a" stroke-width="3" marker-end="url(#arrow)"/>
  <text font-size="12" x="136" y="96" text-anchor="middle" fill="#a32d2d">응답</text>
  <rect x="40" y="112" width="300" height="44" rx="6" fill="none" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4 3"/>
  <text font-size="12" x="190" y="130" text-anchor="middle" dominant-baseline="central" fill="#555">요청·응답 모두 LB 경유</text>
  <text font-size="12" x="190" y="146" text-anchor="middle" dominant-baseline="central" fill="#555">응답 트래픽이 클수록 LB 병목</text>
  <line x1="340" y1="40" x2="340" y2="270" stroke="#ddd" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="510" y="28" text-anchor="middle" fill="#1a1a1a">DSR 방식</text>
  <rect x="360" y="50" width="80" height="36" rx="6" fill="#f1efe8" stroke="#b4b2a9" stroke-width="0.5"/>
  <text font-size="12" x="400" y="68" text-anchor="middle" dominant-baseline="central" fill="#444">클라이언트</text>
  <rect x="465" y="50" width="90" height="36" rx="6" fill="#e1f5ee" stroke="#5dcaa5" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="510" y="62" text-anchor="middle" dominant-baseline="central" fill="#085041">LB</text>
  <text font-size="12" x="510" y="78" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">요청만 경유</text>
  <rect x="580" y="50" width="60" height="36" rx="6" fill="#eeedfe" stroke="#7f77dd" stroke-width="0.5"/>
  <text font-size="12" x="610" y="68" text-anchor="middle" dominant-baseline="central" fill="#3c3489">서버</text>
  <line x1="442" y1="60" x2="463" y2="60" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
  <line x1="557" y1="60" x2="578" y2="60" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text font-size="12" x="510" y="44" text-anchor="middle" fill="#555">요청</text>
  <path d="M578 76 Q488 148 442 76" fill="none" stroke="#1D9E75" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text font-size="12" x="510" y="162" text-anchor="middle" fill="#0f6e56">응답 (LB 우회)</text>
  <rect x="360" y="178" width="300" height="44" rx="6" fill="none" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4 3"/>
  <text font-size="12" x="510" y="196" text-anchor="middle" dominant-baseline="central" fill="#555">요청만 LB 경유</text>
  <text font-size="12" x="510" y="212" text-anchor="middle" dominant-baseline="central" fill="#555">응답은 서버 → 클라이언트 직접</text>
  <line x1="40" y1="242" x2="640" y2="242" stroke="#ddd" stroke-width="0.5"/>
  <text font-size="12" x="340" y="274" text-anchor="middle" dominant-baseline="central" fill="#555">같은 통신, 다른 경로 — 비대칭 구조가 LB 병목을 없앤다</text>
</svg>

설계 초기에 가장 먼저 정한 건 **선**이었다. 요청은 LB를 경유하되, 응답은 LB를 우회한다. 이 비대칭 구조를 구현하기 위해 IP는 그대로 두고 L2 레벨에서 목적지만 바꿔 서버로 전달하는 방식을 택했다. SNAT/DNAT를 하지 않으니 처리가 가볍고, 서버는 클라이언트의 원본 IP를 별도 헤더 파싱 없이 그대로 볼 수 있었다. X-Forwarded-For나 Proxy Protocol 없이도 로깅과 접근 제어가 가능한 구조였다.

세션 분산은 5-tuple(소스 IP/포트, 목적지 IP/포트, 프로토콜) 기반이 기본이다. 세션 지속성을 켜면 소스 IP 기반으로 바뀌어, 소스 포트가 달라도 같은 서버로 고정된다. 로그인 세션처럼 동일 서버에 고정이 필요한 서비스라면 이 옵션을 선택하면 된다.

한 가지 설계 제약을 처음부터 인식했다. 응답이 LB를 우회하는 만큼 서버 측에 설정 부담이 생긴다. 서버는 VIP를 목적지로 들어온 패킷을 받아, VIP를 출발지로 응답해야 한다. 이를 위한 커널 파라미터 설정과 포트 등록이 필요하다. 기능을 만드는 것만큼, 이 설정을 쉽게 따라 할 수 있는 운영 가이드를 제공하는 것도 하나의 과제로 잡았다.

---

## 제약 안에서의 설계

개발 과정은 순탄하지 않았다. 커널 앞단에서 패킷을 처리한다는 선택의 대가로 익숙하던 프로그래밍 자유도를 상당 부분 내려놓아야 했다.

가장 먼저 부딪힌 것은 동적 자료구조였다. 세션 테이블, 멤버 테이블, 분산 테이블 같은 모든 상태를 정해진 형태로만 다뤄야 했고, 일반 라이브러리 호출도 불가능했다. 코드를 커널에 올리는 시점에 모든 실행 경로의 안전성을 정적으로 증명해야 했는데, 패킷 데이터에 접근하는 모든 지점에 경계 검사를 명시해야 하고 포인터 NULL 체크, 루프의 상한도 정적으로 보장돼야 했다. 하나라도 빠지면 로드가 거부됐고, 거부 사유를 추적하는 데 시간이 많이 들었다.

또 다른 벽은 처리 로직의 크기였다. instruction 수 제한이 있어서 복잡한 처리를 쪼개야 했다. 능동적으로 패킷을 만들어 보내야 하는 처리, 예를 들어 헬스체크 probe 송신 같은 작업은 커널 앞단에서 할 수 없었다.

해결의 실마리는 방향을 바꾸는 데 있었다. 제약에 맞서는 대신, 그 안에서 설계하기로 했다. 무거운 계산과 능동적인 처리는 애플리케이션 레이어가 담당하고, 커널 앞단은 빠른 조회만 하도록 역할을 나눴다. 멤버 선택 로직이나 헬스체크 같은 처리는 유저스페이스에서 미리 계산해 채워 넣고, 패킷 경로는 읽기만 했다. 처리 단계를 잘게 나눠 각 프로그램이 감당할 범위를 넘지 않도록 구조를 쪼갰다. 패킷 접근 앞에 항상 경계 검사를 두고, 루프는 상한이 보장되는 형태로만 쓰는 패턴을 정착시켰다.

처음엔 거부당하는 게 답답했지만, 거부 로그를 읽고 고치기를 반복하며 감을 익혔고, 익숙해진 뒤로는 처음부터 통과하는 코드를 쓸 수 있게 됐다. 데이터 경로를 단순하게 유지하니 검증도 수월했고 성능에도 유리했다. 돌아보면 제약이 오히려 코드를 정돈되게 만들었다. 처음엔 불편함이었던 것이, 나중엔 **설계 원칙**이 됐다.

---

## 조용히 동작하는 것들

<svg width="100%" viewBox="0 0 680 370" role="img">
  <title>DSR 패킷 흐름과 멤버 상태 관리</title>
  <desc>클라이언트 요청은 LB를 경유해 ACTIVE 서버로, 서버 응답은 LB를 우회해 클라이언트로 직접 전달된다. LB는 헬스체크로 멤버 상태를 관리하며 INACTIVE 서버는 분산 대상에서 제외된다.</desc>
  <defs>
    <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="40" y="140" width="90" height="44" rx="6" fill="#f1efe8" stroke="#b4b2a9" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="85" y="162" text-anchor="middle" dominant-baseline="central" fill="#444">클라이언트</text>
  <rect x="270" y="120" width="100" height="84" rx="6" fill="#e1f5ee" stroke="#5dcaa5" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="320" y="148" text-anchor="middle" dominant-baseline="central" fill="#085041">LB</text>
  <text font-size="12" x="320" y="166" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">요청 라우팅</text>
  <text font-size="12" x="320" y="182" text-anchor="middle" dominant-baseline="central" fill="#0f6e56">헬스체크</text>
  <rect x="530" y="60" width="110" height="44" rx="6" fill="#eeedfe" stroke="#7f77dd" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="585" y="76" text-anchor="middle" dominant-baseline="central" fill="#3c3489">서버 A</text>
  <text font-size="12" x="585" y="92" text-anchor="middle" dominant-baseline="central" fill="#534ab7">ACTIVE</text>
  <rect x="530" y="150" width="110" height="44" rx="6" fill="#eeedfe" stroke="#7f77dd" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="585" y="166" text-anchor="middle" dominant-baseline="central" fill="#3c3489">서버 B</text>
  <text font-size="12" x="585" y="182" text-anchor="middle" dominant-baseline="central" fill="#534ab7">ACTIVE</text>
  <rect x="530" y="240" width="110" height="44" rx="6" fill="#f1efe8" stroke="#b4b2a9" stroke-width="0.5"/>
  <text font-size="14" font-weight="500" x="585" y="256" text-anchor="middle" dominant-baseline="central" fill="#444">서버 C</text>
  <text font-size="12" x="585" y="272" text-anchor="middle" dominant-baseline="central" fill="#888">INACTIVE</text>
  <line x1="132" y1="158" x2="268" y2="158" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <text font-size="12" x="200" y="148" text-anchor="middle" fill="#555">요청</text>
  <line x1="372" y1="138" x2="528" y2="90" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <line x1="372" y1="162" x2="528" y2="170" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <path d="M528 72 Q300 20 132 150" fill="none" stroke="#1D9E75" stroke-width="2" marker-end="url(#arrow2)"/>
  <path d="M528 178 Q300 260 132 170" fill="none" stroke="#1D9E75" stroke-width="2" marker-end="url(#arrow2)"/>
  <text font-size="12" x="300" y="28" text-anchor="middle" fill="#0f6e56">응답 (LB 우회)</text>
  <line x1="372" y1="168" x2="528" y2="100" stroke="#ccc" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow2)"/>
  <line x1="372" y1="176" x2="528" y2="180" stroke="#ccc" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow2)"/>
  <line x1="372" y1="196" x2="528" y2="252" stroke="#e24b4a" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow2)"/>
  <text font-size="12" x="460" y="226" text-anchor="middle" fill="#a32d2d">헬스체크 실패</text>
  <text font-size="12" x="585" y="304" text-anchor="middle" fill="#a32d2d">분산 제외</text>
  <line x1="40" y1="328" x2="640" y2="328" stroke="#ddd" stroke-width="0.5"/>
  <line x1="60" y1="352" x2="96" y2="352" stroke="#888780" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <text font-size="12" x="106" y="356" dominant-baseline="central" fill="#555">요청 경로</text>
  <line x1="210" y1="352" x2="246" y2="352" stroke="#1D9E75" stroke-width="2" marker-end="url(#arrow2)"/>
  <text font-size="12" x="256" y="356" dominant-baseline="central" fill="#555">응답 경로 (LB 우회)</text>
  <line x1="420" y1="352" x2="456" y2="352" stroke="#ccc" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow2)"/>
  <text font-size="12" x="466" y="356" dominant-baseline="central" fill="#555">헬스체크</text>
</svg>

완성된 Load Balancer(DSR)은 이렇게 동작한다. 클라이언트의 요청은 LB를 경유해 서버로 향한다. IP는 VIP 그대로 유지한 채 L2 레벨에서 목적지만 바꿔 전달된다. 서버의 응답은 LB를 거치지 않고 클라이언트에게 곧장 닿는다. 사이가 있는 것도, 없는 것도 아닌 구조다. 요청 경로에만 LB가 존재하고, **응답 경로에는 없다.**

멤버 상태는 ICMP, TCP, HTTP 세 가지 방식으로 주기적으로 점검한다. 장애가 감지된 서버는 자동으로 분산 대상에서 제외되고, 복구되면 다시 자동으로 포함된다. 멤버는 상태에 따라 ACTIVE와 INACTIVE 사이를 오간다. 멤버로 등록할 수 있는 인스턴스는 동일 서브넷에 위치한 것으로 제한된다.

여러 노드가 동시에 트래픽을 처리하는 Active-Active 구조라, 한 노드에 문제가 생겨도 다른 노드가 이어받는다. 노드 간 세션 상태를 무겁게 동기화하지 않아도 동일한 분산 결정을 내릴 수 있는 구조 덕분이다. Floating IP를 연결하면 외부 네트워크에서도 즉시 접근할 수 있다.

쿼터는 프로젝트당 DSR 10개, DSR당 멤버 30개, 헬스모니터 1개다.

---

## 두 가지 선택지가 생겼다

릴리스 후 어느 오후, 다시 서버 모니터링 대시보드를 열어 보았다. 요청 패킷 하나와 여유로운 CPU. 아무런 문제도 없어 보였다. 로드밸런서(LB)의 트래픽 그래프도 잠잠하였다. 요청과 응답이 다른 경로를 지나고 있었다.

Load Balancer(DSR)은 기존 LB를 대체하지 않는다. L4(TCP, UDP)만 지원하며, L7 라우팅이나 SSL 종단이 필요한 곳엔 프록시 방식이 맞다. Load Balancer(DSR)은 그 구조가 불필요한 곳, 응답이 크거나 낮은 레이턴시와 원본 IP 투명성이 중요한 곳을 위한 다른 선택지다. 미디어 스트리밍, 대용량 파일 다운로드, 게임처럼 응답 트래픽이 큰 서비스라면 Load Balancer(DSR)이 구조적으로 더 맞다. 클라이언트 원본 IP를 서버에서 직접 봐야 하는 서비스라면, 별도 헤더 파싱 없이 바로 활용할 수 있다.

보람이 있었다면 바로 이 지점이다. 커널 단 기술을 실제 상용 네트워크 제품에 녹여 프록시 방식과 다른 처리 성능을 만들어 냈다는 것. 두 옵션을 상황에 맞게 선택할 수 있게 됐다는 것이 이 프로젝트의 본질이다. Load Balancer(DSR)은 지금도 트래픽을 나누고 있지만 아직 완성형은 아니다. 운영 가시성을 높이는 작업이 남아 있다. 경계는 한 번 긋는 것으로 끝나지 않는다.

* [Load Balancer(DSR) 서비스 소개](https://www.nhncloud.com/kr/service/network/load-balancer-dsr)
* [Load Balancer(DSR) 콘솔 사용 가이드](https://docs.nhncloud.com/ko/Network/Load%20Balancer(DSR)/ko/console-guide/)
* 도입 문의: [NHN Cloud 고객지원 > 문의하기](https://www.nhncloud.com/kr/support/inquiry)
