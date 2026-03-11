
```
글 제목: 2025 프론트엔드 뉴스 한 방에 몰아보기
소속 부서: NCUI개발팀
작성자 이름: 이진우
작성자 소개글: NHN Cloud에서 UI 라이브러리와 디자인 시스템을 구축하고 있습니다. 자바스크립트 동작 원리에 관심이 많습니다.
```

# 2025 프론트엔드 뉴스 한 방에 몰아보기

안녕하세요. NHN Cloud NCUI개발팀 이진우입니다.

저는 매주 30여 개의 Web, Frontend, Design, Design System 등의 기술 뉴스레터를 살피고 동료들에게 공유해 왔는데요. 작년에 이어 올해도 개인적으로 인상 깊었던 아티클을 주제별로 공유드리고자 합니다.

> 작년에 공유했던 2024년의 프론트엔드 뉴스 모음은 아래 경로에서 확인하실 수 있습니다.
> 👉 [2024 프론트엔드 뉴스 한 방에 몰아 보기](https://meetup.nhncloud.com/posts/390)

관심사와 조직 내 영향력이 큰 기술 스택을 중심으로 정리한 내용이기에 프론트엔드 생태계 전체를 대변한다고 보기는 어렵지만, 흥미가 가는 주제가 있다면 함께 첨부한 링크들이 출발점으로서 작은 도움이 되기를 바랍니다.

> 본문의 링크들은 과거 시점 기준의 자료이므로 변경된 내용이 있을 수 있습니다. 🙏 

## Node.js의 TypeScript 지원

2025년 초 Node.js는 Bun, Deno와 같은 경쟁자들에게 대적하기 위해 TypeScript 파일 실행 지원을 추가했습니다. 개발자 경험을 향상시키는 것이 주 목적이었기에 타입 체크, 컴파일이 아닌 타입을 걷어내는 것(Type Stripping)으로 방향을 잡았는데요. 이를 위해 SWC를 기반으로 한 Amaro가 핵심 도구로 기대 받았고, TypeScript 측에서도 관련 플래그를 추가했으며 최근 v24.12 버전에서 안정화 단계에 들어서게 되었습니다.

### Type Stripping 개념과 구현

Node.js가 채택한 Type Stripping 방식의 원리와 구현 배경을 다룹니다.

* [Node.js now supports TypeScript by default](https://www.totaltypescript.com/typescript-is-coming-to-node-23)
* [Everything you need to know about node.js type stripping](https://satanacchio.hashnode.dev/everything-you-need-to-know-about-nodejs-type-stripping)
* [The Summer I Shipped Type Stripping](https://satanacchio.hashnode.dev/the-summer-i-shipped-type-stripping)

### 생태계 지원 현황

TypeScript 5.8의 플래그 추가, Amaro 1.0 릴리스, Node.js 안정화 버전 등 생태계 전반의 지원 현황입니다.

* [Announcing TypeScript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/#the---erasablesyntaxonly-option)
* [Node.js Moves Toward Stable TypeScript Support with Amaro 1.0](https://socket.dev/blog/node-js-moves-toward-stable-typescript-support-with-amaro-1-0)
* [Node.js v24.12.0](https://nodejs.org/en/blog/release/v24.12.0)

### 런타임 간 비교

Deno와 Node.js의 TypeScript 지원 비교입니다.

* [Node just added TypeScript support. What does that mean for Deno?](https://deno.com/blog/typescript-in-node-vs-deno)

## React 2025 회고

2025년 React를 보면 프론트엔드의 인프라라고 불러야 할 만큼 범위가 넓어졌습니다. LLM 시대에 React가 사실상 기본 출력물이 되면서 새 프레임워크는 출발부터 불리하다는 주장도 과언이 아닙니다.

작년 말 v19 릴리스 이후 `action`, `useActionState`, `useOptimistic`, `<Activity />` 같은 기능이 추가됐습니다. Form Submit, Loading, Error 등 웹 애플리케이션이 늘 겪는 문제를 React 기본 기능으로 끌어당긴 모양새입니다. 다만 동시성이 기본값이 될수록 개발자도 새로운 규칙을 익혀야 합니다. 코드는 더 선언적으로 보이지만, 어떤 상태를 어떤 방식으로 업데이트할지 조직 내 합의도 필요해질 것 같습니다.

v19 이후 CRA(create-react-app)는 사실상 종료됐습니다. 의존성 충돌을 막기 위한 변경 사항이 병합되긴 했지만, 기존 애플리케이션도 Next.js, React Router, Vite 등으로 전환이 권고됐습니다. 이 권고 문구가 Next.js를 지나치게 강조한다며 커뮤니티에서 논란이 되기도 했습니다. 높은 채택률을 보였던 styled-components도 유지보수 모드로 전환됐습니다.

연말에는 RSC 보안 이슈가 터졌습니다. React가 인프라가 됐다는 말이 과장이 아님을 보여준 사건입니다. 이제 React가 커졌다는 건 기능의 문제가 아니라 책임 범위의 문제로 봐야 할 것 같습니다.

### v19 신규 기능

action, useActionState, useOptimistic, Activity, useEffectEvent, use() 등 v19에서 도입된 주요 기능들입니다.

* [3 ways to build forms in react (without any libraries)](https://reactpractice.dev/articles/3-ways-to-build-forms-in-react)
* [Building Reusable Components with React 19 Actions](https://aurorascharff.no/posts/building-reusable-components-with-react19-actions/)
* [useOptimistic to Make Your App Feel Instant](https://www.epicreact.dev/use-optimistic-to-make-your-app-feel-instant-zvyuv)
* [How React Suspense Works Under the Hood: Throwing Promises and Declarative Async UI](https://www.epicreact.dev/how-react-suspense-works-under-the-hood-throwing-promises-and-declarative-async-ui-plbrh)
* [React Concurrent Features: An Overview](https://certificates.dev/blog/react-concurrent-features-an-overview/)
* [React’s useTransition and state update reordering](https://jordaneldredge.com/notes/react-rebasing/)
* [Using Activity with Suspenseful data](https://www.simeongriggs.dev/use-the-activity-boundary-to-hide-suspenseful-components/)
* [Tried React 19’s Activity Component Here’s What I Learned](https://javascript.plainenglish.io/tried-react-19s-activity-component-here-s-what-i-learned-b0f714003a65)
* [Quick look into the useEffectEvent](https://www.nico.fyi/blog/quick-look-use-effect-event)
* [React 19.2: React in its sigma era](https://dev.to/sagi0312/react-192-react-in-its-sigma-era-op7)
* [React 19.2: The async shift is finally here](https://blog.logrocket.com/react-19-2-the-async-shift/)
* [The next era of React has arrived: Here’s what you need to know](https://blog.logrocket.com/the-next-era-of-react/)
* [React has changed, your Hooks should too](https://allthingssmitty.com/2025/12/01/react-has-changed-your-hooks-should-too/)
* [React RFC: Context Selector](https://github.com/reactjs/rfcs/pull/119/)

### 예외 처리

Error Boundary의 v19 변경 사항과 react-error-boundary 활용법입니다.

* [Error Handling in React with react-error-boundary](https://certificates.dev/blog/error-handling-in-react-with-react-error-boundary)
* [React 19 Error Boundary Behaves Differently](https://andrei-calazans.com/posts/react-19-error-boundary-changed/)

### RSC(React Server Components)

Server Components의 동작 원리와 import 메커니즘입니다.

* [How Imports Work in RSC](https://overreacted.io/how-imports-work-in-rsc/)
* [React Frameworks and Server-Side Features: Beyond Client-Side Rendering](https://certificates.dev/blog/react-frameworks-and-server-side-features-beyond-client-side-rendering)

### RSC 보안 취약점

Flight Protocol 역직렬화 과정의 원격 코드 실행 취약점(CVE-2025-55182)입니다.

* [Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
* [React2Shell Security Bulletin](https://vercel.com/kb/bulletin/react2shell)
* [Understanding the RCE Flaw in React Server Functions](https://gist.github.com/sriram-palanisamy-hat/d207174ada2fa052ad44439f22a65c7e)

### 생태계 변화

CRA 종료와 styled-components 유지보수 모드 전환입니다.

* [create-react-app is a zombie application](https://www.clientserver.dev/p/create-react-app-is-a-zombie-application)
* [Cut styled-components into pieces: This is our last resort](https://www.sanity.io/blog/cut-styled-components-into-pieces-this-is-our-last-resort)

## 조용했던 React Compiler의 시간

작년 이맘때쯤에도 React Compiler를 소개했었는데요. 떠들썩했던 2024년의 분위기와 달리 RC를 거쳐 조용히 React Compiler v1.0.0이 릴리스되었고, 이를 적용하기 위한 점진적 도입 방법에 대한 글이 올라왔습니다. 간간이 성능 개선 사례와 React Compiler를 다루는 아티클이 있었습니다.

### 릴리스와 도입 가이드

RC부터 v1.0.0까지의 릴리스와 점진적 도입 방법입니다.

* [React Compiler RC](https://react.dev/blog/2025/04/21/react-compiler-rc)
* [React Compiler v1.0.0](https://www.npmjs.com/package/babel-plugin-react-compiler/v/1.0.0)
* [Incremental Adoption](https://react.dev/learn/react-compiler/incremental-adoption)

### 실전 적용 사례

프로덕션 환경 도입 경험과 상태 관리 라이브러리와의 관계입니다.

* [Adopting the compiler at wakelet.com in production](https://github.com/reactwg/react-compiler/discussions/52)
* [Thoughts on state management libraries in the react compiler era](https://blog.axlight.com/posts/thoughts-on-state-management-libraries-in-the-react-compiler-era/)

### 트러블슈팅과 내부 모델

Compiler 관련 트러블슈팅과 Compiler에서 값의 변이와 별칭 관계를 추론하는 모델을 설명합니다.

* [use no memo](https://react.dev/reference/react-compiler/directives/use-no-memo)
* [React Compiler’s Silent Failures (And How to Fix Them)](https://acusti.ca/blog/2025/12/16/react-compiler-silent-failures-and-how-to-fix-them/)
* [The Mutability \& Aliasing Model](https://github.com/facebook/react/blob/156b7a96f5669470182ad226306184576d6f150f/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md)

## Next.js의 보안 이슈와 복잡성

어느샌가 프론트엔드는 브라우저를 넘어 서버 영역에 발을 들였습니다. 웹 성능 향상을 위한 기능 개선이 이어졌고, 서버 영역 진출만큼 보안 사고도 발생했습니다. 이 흐름의 중심에 Next.js가 있습니다.

기능이 추가될수록 복잡성도 함께 올라갔고, 많은 개발자가 피로감을 호소한 한 해였습니다. 대안으로 TanStack Start가 자주 언급됐고, Next.js를 떠나는 후기는 어느 순간 메모조차 하지 않을 만큼 많았습니다.

보안 이슈도 빼놓을 수 없습니다. Next.js는 꽤 넓은 버전 범위에 걸쳐 미들웨어 인증 검사를 헤더만으로 우회할 수 있는 취약점이 있었습니다. 클라이언트 요청과 내부 SubRequest를 구분하기 위해 사용한 비공식 헤더가 문제였는데, 이를 악용하면 전혀 관련 없는 경로에 영향을 줄 수 있었습니다. Vercel에서 호스팅된 앱은 자체적으로 방어하고 있었다는 점에서 의문이 들기도 했습니다.

일부 개발자들은 타 호스팅 업체들이 Next.js의 모든 기능을 지원하는 데 어려움을 겪고 있다고 지적했습니다. Next.js가 공식 어댑터를 제공하지 않는 점, 보안 취약점 대응에 소극적이었던 점도 비판의 대상이 됐습니다.

그럼에도 Next.js는 Turbopack, React Compiler, PPR 등을 탑재한 v16을 릴리스하며 업데이트를 이어가고 있고 여전히 긍정적인 시선도 존재합니다.

### 보안 취약점

미들웨어 인증 우회 취약점입니다.

* [Next.js and the corrupt middleware: the authorizing artifact](https://zhero-web-sec.github.io/research-and-things/nextjs-and-the-corrupt-middleware)
* [CVE-2025-29927: Authorization Bypass in Next.js Middleware](https://github.com/advisories/GHSA-f82v-jwr5-mffw)

### 셀프 호스팅과 배포

Vercel 외 환경에서의 Next.js 운영과 셀프 호스팅 가이드입니다.

* [Deploying a Next.js App to Production in any server](https://www.saybackend.com/blog/04-deploy-nextjs-to-production-without-vercel)
* [How we run Next.js today - and what should change](https://www.netlify.com/blog/how-we-run-nextjs/)
* [The Complete Guide to Self-Hosting Next.js at Scale](https://dlhck.com/thoughts/the-complete-guide-to-self-hosting-nextjs-at-scale/)

### Next.js 이탈 사례

다른 프레임워크로 전환한 팀들의 경험담입니다.

* [Why we moved off next.js](https://documenso.com/blog/why-we-moved-off-next-js)
* [We migrated our site to Eleventy and increased performance by 24%](https://etch.co/blog/we-migrated-our-site-to-eleventy-and-increased-performance-by-24-percent/)
* [Why we ditched Next.js and never looked back](https://northflank.com/blog/why-we-ditched-next-js-and-never-looked-back)

### Next.js 비판과 대안

구조적 문제와 도입 전 고려 사항과 대안으로 떠오르는 TanStack Start 관련 내용입니다.

* [You don't need Next.js](https://www.comfydeploy.com/blog/you-dont-need-nextjs)
* [You should know this before choosing Next.js](https://eduardoboucas.com/posts/2025-03-25-you-should-know-this-before-choosing-nextjs/)
* [Why Next.js Falls Short on Software Engineering](https://blog.webf.zone/why-next-js-falls-short-on-software-engineering-d3575614bd08)
* [Architecting with Constraints: A Pragmatic Guide](https://www.lorenstew.art/blog/always-architect-with-contraints/)
* [Next.js vs Tanstack](https://www.kylegill.com/essays/next-vs-tanstack/)
* [TanStack Start: New competitor to Next.js](https://ondrejvelisek.github.io/tanstack-start-new-competitor-to-nextjs/)
* [Why developers are leaving Next.js for TanStack Start, and loving it](https://appwrite.io/blog/post/why-developers-leaving-nextjs-tanstack-start)

### 긍정적 전말과 릴리스

Next.js의 미래에 대한 긍정적 시각과 렌더링 방식에 대한 이해입니다.

* [I like the future of Next.js](https://tigerabrodi.blog/i-like-the-future-of-nextjs)
* [How to understand the concepts of Next.js such as CSR , SSR, SSG, ISR, RSC, SPA, and Streaming SSR?](https://dev.to/nextjser/how-to-understand-the-concepts-of-nextjs-such-as-csr-ssr-ssg-isr-rsc-spa-and-streaming-ssr-pl3)

## npm 보안 위기의 해

2025년은 보안 사고가 끊이지 않았습니다. 공급망 공격을 비롯한 여러 보안 취약점 등이 있었습니다. 다행히 최근 주요 플랫폼들이 발빠르게 대응하며 보안 체계를 갖춰가고 있습니다. 

### 개발자 계정 탈취로 인한 공급망 공격

유명 라이브러리의 개발자들이 피싱으로 계정이 탈취되었고 이에 따라 오염된 패키지가 배포되는 사건들이 있었습니다.

* [npm Author Qix Compromised via Phishing Email in Major Supply Chain Attack](https://socket.dev/blog/npm-author-qix-compromised-in-major-supply-chain-attack)
* [npm debug and chalk packages compromised](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised)
* [Version 5.6.1 published to npm is compromised (RESOLVED)](https://github.com/chalk/chalk/issues/656)
* [infowski - hackerspace.pl](https://social.hackerspace.pl/@informatic/115168929981581855)
* [DuckDB npm Account Compromised in Continuing Supply Chain Attack](https://socket.dev/blog/duckdb-npm-account-compromised-in-continuing-supply-chain-attack)
* [DuckDB NPM packages 1.3.3 and 1.29.2 compromised with malware](https://github.com/duckdb/duckdb-node/security/advisories/GHSA-w62p-hx95-gf2c)
* [eslint-config-prettier Compromised: How npm Package with 30 Million Downloads Spread Malware](https://safedep.io/eslint-config-prettier-major-npm-supply-chain-hack/)
* [Popular npm linter packages hijacked via phishing to drop malware](https://www.bleepingcomputer.com/news/security/popular-npm-linter-packages-hijacked-via-phishing-to-drop-malware/)
* [npm Phishing Email Targets Developers with Typosquatted Domain](https://socket.dev/blog/npm-phishing-email-targets-developers-with-typosquatted-domain)
* [Josh Junon - bluesky](https://bsky.app/profile/bad-at-computer.bsky.social/post/3lydioq5swk2y)
* [JounQin - X](https://x.com/JounQin/status/1946297662069993690)
* [npm ‘is’ Package Hijacked in Expanding Supply Chain Attack](https://socket.dev/blog/npm-is-package-hijacked-in-expanding-supply-chain-attack)
    [](https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages)
* [Popular Tinycolor npm Package Compromised in Supply Chain Attack Affecting 40+ Packages](https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages)
* [ctrl/tinycolor and 40+ NPM Packages Compromised](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised)


### Shai-Hulud 공격

Shai-Hulud 대규모 공급망 공격 분석입니다.

* [Shai-Hulud Returns: Over 1K NPM Packages and 27K+ Github Repos infected via Fake Bun Runtime Within Hours](https://helixguard.ai/blog/malicious-sha1hulud-2025-11-24)
* [The Shai-Hulud 2.0 npm worm: analysis, and what you need to know](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/)
* [NPM Security Best Practices: How to Protect Your Packages After the 2025 Shai Hulud Attack](https://snyk.io/fr/articles/npm-security-best-practices-shai-hulud-attack/)
* [GitLab discovers widespread npm supply chain attack](https://about.gitlab.com/blog/gitlab-discovers-widespread-npm-supply-chain-attack/)

### 플랫폼 보안 강화

npm과 Github의 인증 체계 개선과 보안 기능 업데이트입니다.

* [npm classic tokens revoked, session-based auth and CLI token management now available](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)
* [npm trusted publishing with OIDC is generally available](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/)
* [How We're Protecting Our Newsroom from npm Supply Chain Attacks](https://pnpm.io/blog/2025/12/05/newsroom-npm-supply-chain-security)

### 도구

보안 강화를 위한 다양한 라이브러리입니다.

* [safe-npm](https://github.com/kevinslin/safe-npm)
* [npq](https://github.com/lirantal/npq)
* [reproduce](https://github.com/vltpkg/reproduce)
* [exposedbydefault](https://github.com/neberej/exposedbydefault)

## 빌드 도구의 Rust 전환

작년에 이어 JavaScript 툴체인의 Rust 재작성이 가속화되고 있습니다. Rust 전환 시 기존 대비 10-100배의 성능 향상이 가능하기 때문에, 복잡해진 프론트엔드 생태계에서 이 흐름은 이제 거스르기 어려워 보입니다.

가장 두드러진 성과를 내는 곳은 VoidZero로 보입니다. Rolldown, Oxc, Oxfmt, Oxlint 등의 프로젝트를 운영하고 있습니다. 이 외에도 ByteDance의 Rsbuild/Rspack, 통합 툴체인 Deno, Vercel의 Turbopack, Meta의 Buck2 등이 있습니다.

개인적인 경험도 있습니다. NCUI가 실제 서비스에서 어떻게 사용되는지 추적하기 위해 만든 사이드 프로젝트에서 JavaScript 기반 분석 도구를 SWC 기반으로 재개발했는데 처리 속도가 50배 이상 빨라졌습니다.

Vite는 지속적인 업데이트 끝에 Rolldown을 탑재한 v8 메이저 업데이트를 앞두고 있습니다. 아직 Webpack을 사용 중이라면 마이그레이션을 검토해 볼 만합니다.

### Voidzero의 소식

Voidzero 진영의 Rolldown 번들러 소식과 Oxlint 관련 내용입니다.

* [How Rolldown Works: Module Loading, Dependency Graphs, and Optimization Explained](https://www.atriiy.dev/blog/rolldown-module-loader-and-dependency-graph/)
* [Rolldown 1.0 Beta](https://github.com/rolldown/rolldown/releases/tag/v1.0.0-beta.1)
* [Vite 8 Beta: The Rolldown-powered Vite](https://vite.dev/blog/announcing-vite8-beta)
* [tsdown](https://github.com/rolldown/tsdown)
* [Oxlint v1](https://oxc.rs/blog/2025-06-10-oxlint-stable.html)
* [Faster Type-Aware Lint Rules: Biome vs. Oxlint](https://www.solberg.is/fast-type-aware-linting/)
* 🐦 [Vite just passed Webpack in weekly npm downloads](https://x.com/youyuxi/status/1950234261573038444)

### 번들러 비교와 전망

* [The JavaScript Bundler Grand Prix](https://redmonk.com/kholterhoff/2025/12/16/javascript-bundler-grand-prix/)
* [Bundler Explorer](https://bundler.sxzz.dev/)
* [Speeding up the JavaScript ecosystem - Rust and JavaScript plugins](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-11/)

## 새로운 HTML/CSS 네이티브 기능의 폭발

Baseline, Interop 활동에 힘입어 HTML/CSS 네이티브 기능이 쏟아졌습니다. 사실 이런 주제의 아티클은 꾸준히 올라오지만, 최신 브라우저만을 사용자 환경으로 전제할 수 없어 깊이 들여다보지 못한 경우가 많았습니다. 그래도 관심을 놓지 않고 있다가 충분히 사용 가능한 시점에 네이티브로 전환하면 제품 품질이 확실히 좋아질 거라 생각합니다.

### 네이티브 UI 컴포넌트

기존에 JavaScript로 구현하던 Tooltip, Popover, Dropdown 같은 UI 패턴을 네이티브로 지원합니다.

* [The Basics of Anchor Positioning](https://ishadeed.com/article/anchor-positioning/)
* [Better anchor positioning with position-area](https://www.oddbird.net/2025/02/25/anchor-position-area/)
* [Follow-the-leader pattern with CSS anchor positioning](https://una.im/follow-the-anchor/)
* [The popover api is now baseline newly available](https://web.dev/blog/popover-baseline?hl=en)
* [What is popover=hint?](https://una.im/popover-hint/)
* [The `<select>` element can now be customized with CSS](https://developer.chrome.com/blog/a-customizable-select?hl=en)
* [Updates to the customizable select API](https://una.im/select-updates/)

### CSS 조건문

if() 함수로 CSS 속성 값 내에서 인라인 조건부 로직을 구현합니다.

* [CSS conditionals with the new if() function](https://developer.chrome.com/blog/if-article/)
* [Introduction to CSS if Statements and Conditional Logic](https://markodenic.com/introduction-to-css-if-statements-and-conditional-logic/)
* [CSS custom functions are coming ... and they are going to be a game changer](https://www.bram.us/2025/02/09/css-custom-functions-teaser/)

### 레이아웃

Subgrid와 반응형 디자인 기능입니다. 참고로 작년 주제였던 Masonry 레이아웃은 여전히 진행 중입니다.

* [Brand New Layouts with CSS Subgrid](https://www.joshwcomeau.com/css/subgrid/)
* [Taking RWD(Responsive Web Design) to the extreme](https://www.smashingmagazine.com/2025/02/taking-rwd-to-the-extreme/)
* [How much do you really know about media queries?](https://frontendmasters.com/blog/learn-media-queries/)
* [Grid Lanes Layout Model](https://www.w3.org/TR/css-grid-3/#grid-lanes-model)
* [MDN - Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)

### 색상과 스타일링

* [CSS Custom Properties vs. Sass Variables: A Pragmatic Guide](https://www.alwaystwisted.com/articles/css-vs-sass)
* [A pragmatic guide to modern CSS colours - part one](https://piccalil.li/blog/a-pragmatic-guide-to-modern-css-colours-part-one/)
* [Making Context-Aware Components: How CSS inherit() Could Simplify Design Systems](https://www.alwaystwisted.com/articles/making-context-aware-components)

### 새로운 Web API

Temporal, Clipboard, Sanitizer, moveBefore 등 신규 브라우저 API와 제안입니다.

* [The Clipboard API: How Did We Get Here?](https://cekrem.github.io/posts/clipboard-api-how-hard-can-it-be/)
* [Temporal API is coming](https://developer.mozilla.org/en-US/blog/javascript-temporal-is-coming/)
* [Why the Sanitizer API is just setHTML()](https://frederikbraun.de/why-sethtml.html)
* [Move elements around the DOM while preserving their state with moveBefore](https://www.bram.us/2025/01/16/move-elements-around-the-dom-while-preserving-their-state-with-movebefore/)
* [Making complex web apps faster](https://blogs.windows.com/msedgedev/2025/12/09/making-complex-web-apps-faster/)

### 종합 가이드

HTML/CSS 신기능 전반을 다룹니다.

* [Relatively new things you should know about HTML heading into 2025](https://frontendmasters.com/blog/bone-up-html-2025/)
* [Perfecting Baseline](https://piccalil.li/blog/perfecting-baseline/)
* ▶️ [25 new \& rad feature of CSS](https://www.youtube.com/watch?v=QW6GECIzvsw)
* [CSS Wrapped 2025](https://chrome.dev/css-wrapped-2025/)

## AI 트렌드

프론트엔드를 떠나 IT 산업 전반을 돌아보면, 2025년은 단연 LLM/AI가 가장 뜨거운 키워드였습니다. 상반기만 해도 MCP 프로토콜 소개나 LLM 기반 코드 개발 후기 정도가 화제였는데, 불과 몇 달 만에 양상이 달라졌습니다. Angular, Svelte, Chrome DevTools 등 주요 프레임워크가 공식 MCP 서버를 출시했고, Spotify와 Amazon 팀의 실전 도입 사례가 속속 공개되기 시작했습니다. 바이브 코딩, 컨텍스트 엔지니어링, 스펙 주도 개발 같은 방법론이 등장했고, 최근에는 Claude에서 Skills라는 도구까지 나왔습니다.

자연스럽게 프론트엔드 영역의 생산성 개선에 관심이 쏠렸습니다. 하지만 LLM은 복잡한 인터랙션 처리에서 한계를 드러냈고, 기대만큼의 임팩트를 보여주진 못했습니다. 이 시기에 AI의 한계를 지적하는 글, 코드 리뷰의 중요성을 강조하는 글, 엔지니어의 책임을 다시 정의하는 글이 쏟아졌습니다. 미래를 단언할 수는 없지만, 현 시점에서는 개발자의 판단력이 여전히 핵심이라는 데 대체로 의견이 모이는 분위기입니다.

그럼에도 프론트엔드와 AI의 접점은 계속 넓어지고 있습니다. LLM이 웹 브라우저를 직접 제어하고, React 컴포넌트를 해석하는 도구들이 등장했습니다. Figma는 빠른 속도로 AI 기능을 도입하고 있고, 디자인 토큰을 AI가 읽을 수 있는 구조로 재설계하자는 제안도 나오고 있습니다.

2025년 한 해를 돌아보면 솔직히 동네 축구 같다는 생각도 듭니다. '이게 좋다' 하면 모두가 몰려가고, '저게 정답이다' 하면 또 그쪽으로 쏠리는 흐름이 반복됐습니다. 그 와중에 인상 깊었던 LLM 사용 사례와 아티클, 도구를 정리해 공유합니다.

### AI 코딩의 한계와 책임

LLM 기반 개발의 한계점과 개발자 책임에 대한 논의입니다.

* [Can LLMs write better code if you keep asking them to "write better code?"](https://minimaxir.com/2025/01/write-better-code/)
* [Why you shouldn't use AI to write documentation](https://zeroheight.com/blog/why-you-shouldnt-use-ai-to-write-documentation/)
* [Why Your AI Coding Assistant Keeps Doing It Wrong, and How To Fix It](https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/)
* [Your job is to deliver code you have proven to work](https://simonwillison.net/2025/Dec/18/code-proven-to-work/)
* [dead framework theory](https://aifoc.us/dead-framework-theory/)
* [How to Fix Any Bug](https://overreacted.io/how-to-fix-any-bug/)

### 기업 도입 사례

Spotify, Airbnb 등 대규모 조직의 AI 도입 경험입니다.

* [1,500+ PRs Later: Spotify’s Journey with Our Background Coding Agent (Part 1)](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
* [The New Calculus of AI-based Coding](https://blog.joemag.dev/2025/10/the-new-calculus-of-ai-based-coding.html)
* [Accelerating Large-Scale Test Migration with LLMs](https://medium.com/airbnb-engineering/accelerating-large-scale-test-migration-with-llms-9565c208023b)

### MCP와 컨텍스트 엔지니어링

Model Context Protocol과 효과적인 AI 활용을 위한 컨텍스트 설계입니다.

* [MCP explained without hype of fluff](https://blog.nilenso.com/blog/2025/05/12/mcp-explained-without-hype-or-fluff)
* [Chrome DevTools MCP Server](https://developer.chrome.com/blog/chrome-devtools-mcp)
* [Getting AI to Work in Complex Codebases](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
* [Minification isn't obfuscation - Claude Code proves it](https://martinalderson.com/posts/minification-isnt-obfuscation-claude-code-proves-it/)

### AI시대의 개발 방법론

API 설계, 문서화, 추상화 등 AI와 함께하는 개발 방법론입니다.

* [How to Design APIs for an AI World 🔌](https://refactoring.fm/p/how-to-design-apis-for-an-ai-world)
* [Writing documentation for AI: best practices](https://docs.kapa.ai/improving/writing-best-practices/)
* [The New Calculus of AI-based Coding](https://blog.joemag.dev/2025/10/the-new-calculus-of-ai-based-coding.html)
* [Conversation: LLMs and Building Abstractions](https://martinfowler.com/articles/convo-llm-abstractions.html)
* [Attention Is the New Big-O](https://alexchesser.medium.com/attention-is-the-new-big-o-9c68e1ae9b27/)

### 유용한 도구

AI 개발에 활용할 수 있는 도구입니다.

* [repomix](https://github.com/yamadashy/repomix) - 전체 Repository를 AI 친화적인 단일 파일로 압축
* [repo2txt](https://github.com/abinthomasonline/repo2txt) - GitHub Repository를 단일 텍스트로 변환, GUI 기반으로 파일 선택 가능
* [ai-digest](https://github.com/khromov/ai-digest) - 코드베이스를 하나의 마크다운 파일로 생성
* [claude-flow](https://github.com/ruvnet/claude-flow) - Claude 기반 AI 에이전트를 여러 개 연결해 협업, 복잡한 작업을 단계별 워크플로우로 자동화
* [agent-rules](https://github.com/steipete/agent-rules) - Cursor, Claude Code 같은 AI 코드 어시스턴트에게 일관된 행동 지침을 적용하는 규칙 템플릿 모음
* [Conductor](https://conductor.build/) - Claude Code를 여러 개 동시에 실행하며 관리하는 도구
* [Terragon](https://www.terragonlabs.com/) - Claude Code, OpenAI Codex 등 AI 코딩 에이전트를 클라우드에서 병렬 실행
* [react-grab](https://github.com/aidenybai/react-grab) - 페이지의 모든 요소를 선택해 AI 코딩 에이전트에게 컨텍스트로 전달, 단일 스크립트 태그로 설치
* [MCP Registry](https://github.com/mcp) - GitHub에서 다양한 MCP 서버를 모아둔 레지스트리
* [streamdown](https://streamdown.ai/) - AI Chat 서비스처럼 마크다운 스트리밍 렌더링 지원
* [lean-spec](https://github.com/codervisor/lean-spec) - 경량 SDD(Spec-Driven Development) 프레임워크

## 그 외 분야별 소식

### JavaScript/TypeScript

2025년도 JavaScript와 TypeScript 생태계는 활발하게 움직였습니다. TypeScript 7의 Go 포팅 소식, 다양한 언어 패턴과 보안 이슈, 그리고 JSDoc을 활용한 타입 안정성 확보 방법 등 주요 소식을 정리했습니다.

#### 언어 기능과 패턴

JavaScript의 다양한 언어 기능과 활용 패턴입니다.

* [There are a lot of ways to break up long tasks in JavaScript](https://macarthur.me/posts/long-tasks/)
* [Breaking Up with Long Tasks or: how I learned to group loops and wield the yield](https://calendar.perfplanet.com/2024/breaking-up-with-long-tasks-or-how-i-learned-to-group-loops-and-wield-the-yield/)
* [Category Theory for JavaScript/TypeScript Developers](https://ibrahimcesar.cloud/blog/category-theory-for-javascript-typescript-developers/)
* [Say bye with JavaScript Beacon](https://hemath.dev/blog/say-bye-with-javascript-beacon/)
* [Using await at the top level in ES Modules](https://allthingssmitty.com/2025/06/16/using-await-at-the-top-level-in-es-modules/)
* [30 Years of JavaScript: 10 Milestones That Changed the Web](https://thenewstack.io/30-years-of-javascript-10-milestones-that-changed-the-web/)
* [How to Control the Number of Concurrent Promises in JavaScript](https://dev.to/zacharylee/how-to-control-the-number-of-concurrent-promises-in-javascript-3mg8)
* [Deeply immutable data structures](https://sanjeettiwari.com/notes/deeply-immutable-structures)
* [JavaScript's Promise.race and Promise.all Are Not "Fair"](https://v5.chriskrycho.com/notes/javascript-promise-race-and-promise-all-are-not-fair/)
* [Sustainable simplicity](https://frontendatscale.com/issues/42)

#### TypeScript의 활용

TypeScript의 고급 기능과 타입 시스템 활용법입니다.

* [TypeScript vs Zod: Clearing up validation confusion](https://blog.logrocket.com/when-use-zod-typescript-both-developers-guide)
* [6 Advanced TypeScript Tricks](https://sinja.io/blog/advanced-typescript)
* [The Multi-Repository TypeScript Problem](https://www.carrick.tools/blog/the-multi-repository-typescript-problem/)

#### JSDoc 활용

TypeScript 없이 JSDoc으로 타입 안정성을 확보하는 방법입니다.

* [The Nuances of JavaScript Typing using JSDoc](https://thathtml.blog/2025/12/nuances-of-typing-with-jsdoc/)
* [How JSDoc Saved My Dev Workflow](https://spin.atomicobject.com/how-jsdoc-saved-my-dev-workflow/)

#### TypeScript 생태계

TypeScript의 발전 방향과 생태계 변화입니다.

* [TypeScript’s rise in the AI era: Insights from Lead Architect, Anders Hejlsberg](https://github.blog/developer-skills/programming-languages-and-frameworks/typescripts-rise-in-the-ai-era-insights-from-lead-architect-anders-hejlsberg/)
* [The Inner Workings of JavaScript Source Maps](https://www.polarsignals.com/blog/posts/2025/11/04/javascript-source-maps-internals)
* [TypeScript is going Go: Why it's the pragmatic choice](https://johnnyreilly.com/typescript-go-pragmatic-choice)

#### 보안

JavaScript 시큐어 코딩 관련 내용입니다.

* [How to consume APIs in React using Fetch and Async/Await](https://blog.codeminer42.com/how-to-consume-apis-in-react-using-fetch-and-async-await/)

### 프레임워크

앞서 언급한 React 외 주요 프레임워크들의 2025년 소식을 정리했습니다. Remix의 React 결별 선언, Svelte의 성능 입증, Angular의 Zoneless 안정화 등 흥미로운 변화가 많았습니다.

#### Remix

React와 결별하고 웹 표준 중심으로 재구상된 Remix v3 소식입니다.

* [Wake Up! Remix](https://remix.run/blog/wake-up-remix)
* [Remix Jam 2025](https://remix.run/jam/2025)
* [React and Remix Choose Different Futures](https://laconicwit.com/react-and-remix-choose-different-futures/)
* [Remix 3 and the End of React-Centric Architectures](https://thenewstack.io/remix-3-and-the-end-of-react-centric-architectures/)
* [Just JavaScript](https://pedrocattori.com/posts/just-javascript/)
* 🐦 [Remix v3 Preact 기반 계획 취소](https://x.com/mjackson/status/1955083457144762729)
* [Remixing Shopify's Admin](https://shopify.engineering/remixing-admin)

#### Svelte

개발자 만족도 1위, 성능 벤치마크에서도 가장 빠른 성능을 기록한 Svelte 소식입니다.

* [What's new in Svelte: November 2025](https://svelte.dev/blog/whats-new-in-svelte-november-2025)
* [Svelte really is that fast](https://chuniversiteit.nl/papers/svelte-is-fast)
* [Why startups choose React (and when you shouldn't)](https://evilmartians.com/chronicles/why-startups-choose-react-and-when-you-should-not)

#### Angular

Zoneless 안정화와 시그널 기반 반응성 API를 도입한 Angular 소식입니다.

* [Angular Summer Update 2025](https://blog.angular.dev/angular-summer-update-2025-1987592a0b42)
* [Angular 2025 Strategy](https://blog.angular.dev/angular-2025-strategy-9ca333dfc334)

#### Vue / Nuxt

Vercel의 Nuxt 인수와 Vue 생태계 현황입니다.

* [State of Vue.js Report 2025](https://www.monterail.com/)
* [NuxtLabs joins Vercel](https://vercel.com/blog/nuxtlabs-joins-vercel)
* [How to build Microfrontends with Module Federation and Vue](https://alexop.dev/posts/how-to-build-microfrontends-with-module-federation-and-vue/)

#### Astro

클라이언트 JavaScript 최소화와 Content Collections 진화 소식입니다.

* [What's new in Astro - January 2025](https://astro.build/blog/whats-new-january-2025/)
* [Live Content Collections: A Deep Dive](https://astro.build/blog/live-content-collections-deep-dive/)
* [Why use React?](https://adactio.com/journal/22265)

#### htmx

"하위 호환성 없는 v3.0은 절대 출시하지 않겠다"는 약속 때문에 v3를 건너뛰고 v4 출시한 htmx 소식입니다.

* [htmx v4](https://htmx.org/essays/the-fetchening/)

### 디자인 시스템

2025년 디자인 시스템 생태계는 AI 시대를 맞아 큰 전환점을 맞이했습니다. Claude Skills와 Figma MCP 서버의 등장으로 디자인 시스템 팀이 AI를 활용해 마이그레이션 자동화, Storybook 스토리 생성, 토큰 검증 등 반복적인 작업을 자동화할 수 있게 되었고, 이에 따라 디자인 토큰을 AI가 올바르게 이해할 수 있도록 시맨틱 네이밍과 메타데이터를 추가하는 구조화가 새로운 과제로 언급되었습니다.

컴포넌트 설계 철학에서는 합성이 하나의 패러다임으로 떠올랐습니다. Figma의 네이티브 슬롯 지원을 계기로 고정된 컴포넌트 대신 기본 컨테이너와 재사용 가능한 자식 요소를 분리해 제공하는 방식이 확산되었고, 다중 추상화 계층 접근법도 주목 받았습니다.

디자인 토큰 영역에서는 DTCG가 18개월간 여러 가지 스펙 업데이트를 발표한 반면, 흥미롭게도 디자인 토큰이라는 용어를 처음 만든 Salesforce는 복잡해진 토큰 스펙 대신 CSS 커스텀 프로퍼티로 회귀했습니다. Figma 역시 토큰 대신 변수라는 용어를 선택하며, 업계가 토큰의 복잡성과 단순함 사이에서 균형점을 찾고 있음을 보여줍니다.

#### 설계 철학과 전략

디자인 시스템의 본질과 성공 전략에 대한 논의입니다.

* [Beyond the Plateau of Sameness](https://yeseniaperezcruz.substack.com/p/beyond-the-plateau-of-sameness)
* [Bias in Design Systems](https://bencallahan.com/bias-in-design-systems)
* [The future of design systems is decentralized](https://uxdesign.cc/the-future-of-design-systems-is-decentralized-770db996442c)
* [The dumbest design system mistakes](https://learn.thedesignsystem.guide/p/the-dumbest-design-system-mistakes)
* [Design System Tactics](https://redesigningdesign.systems/tactics/all-tactics)
* [designtokens.fyi](https://designtokens.fyi/)

#### 컴포넌트 설계

슬롯, 컴포지션, 추상화 계층 등 컴포넌트 설계 패턴입니다.

* [Slots in Design Systems](https://nathanacurtis.substack.com/p/slots-in-design-systems)
* [Using composability over inheritance to scale design systems](https://zeroheight.com/blog/using-composability-over-inheritance-to-scale-design-systems/)
* [Multiple Layers of Abstraction in Design Systems](https://engineering.atspotify.com/2023/05/multiple-layers-of-abstraction-in-design-systems/)
* [The power of relationships in design systems](https://learn.thedesignsystem.guide/p/the-power-of-relationships-in-design)

#### 디자인 토큰

토큰 스펙 진화와 실무 활용법입니다.

* [What's new in the Design Tokens spec](https://zeroheight.com/blog/whats-new-in-the-design-tokens-spec/)
* [Design Token-Based UI Architecture](https://martinfowler.com/articles/design-token-based-ui-architecture.html)
* [A Design Token Workflow](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-1)
* [Generating Utility Classes from Design Tokens](https://www.alwaystwisted.com/articles/a-design-tokens-workflow-part-13)
* [Avoiding Tokens](https://blog.damato.design/posts/avoiding-tokens/)
* [Introducing Design Tokens Language Server](https://bennypowers.dev/posts/introducing-design-tokens-language-server/)

#### AI와 디자인 시스템

AI 시대에 디자인 시스템을 활용하고 최적화하는 방법입니다.

* [3 practical ways LLMs can support design systems teams today](https://zeroheight.com/blog/3-practical-ways-llms-can-support-design-systems-teams-today/)
* [Why your design system team need Claude Skills](https://learn.thedesignsystem.guide/p/why-your-design-system-team-need)
* [Design tokens that AI can actually read](https://learn.thedesignsystem.guide/p/design-tokens-that-ai-can-actually)
* [How to build patterns from your design system components with AI](https://learn.thedesignsystem.guide/p/how-to-build-patterns-from-your-design)

#### 문서화와 운영

디자인 시스템 문서화, 접근성 감사, 유지보수 전략 및 운영입니다.

* [How to document your design system components](https://zeroheight.com/blog/how-to-document-your-design-system-components/)
* [When's the right time to start documenting your design system?](https://zeroheight.com/blog/whens-the-right-time-to-start-documenting-your-design-system/)
* [Storefront \& Warehouse](https://blog.damato.design/posts/storefront-warehouse/)
* [Design tokens aren't enough. ADR need a place](https://samiamdesigns.substack.com/p/design-tokens-arent-enough-architecture)
* [Retrofitting a Design System Into an Existing Product](https://medium.com/@anilpak35/retrofitting-a-design-system-into-an-existing-product-a9ebfe3d7d30)

### 라이브러리

개발 생산성을 높여주는 다양한 도구들이 등장했습니다. UI 관련 라이브러리, 프로젝트 분석, TypeScript 개발, 보안, 테스트까지 카테고리별로 정리했습니다.

#### UI 컴포넌트

shadcn/ui는 지속적으로 엄청난 확장을 거듭하며 가장 영향력 있는 생태계 중 하나가 되었고, 지속적으로 주목받던 Base UI가 v1을 릴리스했습니다.

* [shadcn/ui](https://ui.shadcn.com/) - CLI 3.0, Monorepo 지원, 다양한 신규 컴포넌트
* [shadcn/ui.create](https://ui.shadcn.com/create) - GUI로 자신만의 shadcn/ui 구성
* [shadcn.io](https://www.shadcn.io/) - MIT 라이선스 무료 컴포넌트 커뮤니티 레지스트리
* [shadcn/ui Form documentation](https://ui.shadcn.com/docs/forms) - React Hook Form, TanStack Form 통합 가이드
* [themecn](https://themecn.dev/) - shadcn 기반 테마 생성기
* [formcn](https://formcn.dev/) - shadcn 기반 양식 생성기
* [base-ui v1.0](https://base-ui.com/) - Radix, Material UI, Floating UI 개발자들의 컴포넌트 재정의
* [Headless Tree](https://headless-tree.lukasbach.com/) - 트리 컴포넌트 라이브러리

#### 프로젝트 분석

코드베이스와 의존성을 분석하고 정리하는 도구들입니다.

* [Knip](https://knip.dev/) - 불필요한 파일, 의존성, 내보내기 등을 JavaScript/TypeScript 프로젝트에서 추출
* [qnm](https://github.com/ranyitz/qnm) - node\_modules 탐색 CLI, 퍼지 검색, 패키지 설치 이유 설명, 모노레포 지원
* [API Extractor](https://api-extractor.com/) - TypeScript 라이브러리 API 관리, 변경 감지, export 검증, .d.ts rollup 생성
* [sonda](https://github.com/filipsobol/sonda) - 소스맵 분석으로 트리쉐이킹/압축 후 실제 모듈 크기 시각화

#### TypeScript 개발 도구

TypeScript 개발 경험을 개선하는 도구들입니다.

* [ts-migrating](https://github.com/ycmjason/ts-migrating) - strict 모드 등 새 compilerOptions를 점진적으로 적용, @ts-migrating 주석으로 라인별 제어
* [ts-exec](https://github.com/poppinss/ts-exec) - SWC로 Node에서 TypeScript 실행, ts-node/tsx 문제 해결
* [ts-to-zod](https://github.com/fabien0102/ts-to-zod) - TypeScript 타입/인터페이스에서 Zod 스키마 자동 생성
* [typia](https://github.com/samchon/typia) - 컴파일 타임에 타입 정보만으로 유효성 검사, 간단한 문법

#### 데이터 검증과 HTTP

데이터 검증과 HTTP 요청을 다루는 라이브러리들입니다.

* [Of Coerce!](https://github.com/kossnocorp/ofcoerce) - Zod/Valibot 경량 대안, FormData 직접 처리, RSC 폼에 유용
* [ffetch](https://github.com/fetch-kit/ffetch) - TypeScript HTTP 클라이언트, 타임아웃/재시도/중복 제거 내장
* [ky](https://github.com/sindresorhus/ky) - Fetch API 기반 HTTP 클라이언트, 자동 재시도/타임아웃/JSON 옵션, 의존성 없음
* [upfetch](https://github.com/L-Blondy/up-fetch) - fetch 개선 TypeScript 라이브러리

#### 기타

다양한 개발 편의 도구들입니다.

* [vercel/bidc](https://github.com/vercel/bidc) - 워커/iframe/서비스 워커 간 양방향 비동기 통신, Promise/Map/Set 전송 지원
* [dotter](https://github.com/SuperCuber/dotter) - Rust 기반 dotfile 관리자, 심볼릭 링크와 템플릿화로 여러 머신 설정 관리
* [globby](https://github.com/sindresorhus/globby) - fast-glob 기반 사용자 친화적 glob 매칭, .gitignore 인식
* [nstr](https://github.com/shuding/nstr) - 부동소수점 정밀도 오류 자동 감지/수정, UI 표시에 적합한 형태로 변환
* [i18n-check](https://github.com/lingualdev/i18n-check) - i18next 번역 파일에서 누락/손상된 키 검사, CI 사용 가능

## 정리하며

2025년을 돌아보면 프론트엔드의 영역은 분명히 많이 확장되었습니다. React는 점점 기반 인프라에 가까워졌고, Next.js와 npm, 빌드 도구, 웹 플랫폼 전반에서도 변화가 이어졌습니다. 그 과정에서 복잡성은 늘었고, 따라가야 할 것도 많아진 한 해였습니다.

내년에도 어떤 변화가 이어질지는 모르겠지만, 이 글이 관심 가는 주제를 찾거나 놓친 흐름을 되짚는 출발점이 되었으면 합니다. 감사합니다.