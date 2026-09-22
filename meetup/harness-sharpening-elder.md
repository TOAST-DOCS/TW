```
글 제목: 나는 하네스 깎는 노인이 되었다 1편: 은총알은 없다
소속 부서: 메시징플랫폼개발팀
작성자 이름: 이재형
작성자 소개글: NHN Cloud에서 Notification 서비스 개발을 담당하고 있습니다.
```

# 나는 하네스 깎는 노인이 되었다 시리즈 1: 은총알은 없다

> 이 글은 김영우님의 '<span style="color: rgb(8, 8, 9);">AI 하네스 깎는 노인'을 감명깊게 보고 한달간 직접 하네스 깎는 노인이 되어 경험한 내용을 담은 글입니다.</span>
>
> [https://www.facebook.com/smileoncold/posts/pfbid02f92PHcQ5huEthJZD5GE8gkhgR2TBmeSSTvioqpNrsbV1BCufGKHJq1S7EEdfyh8Vl](https://www.facebook.com/smileoncold/posts/pfbid02f92PHcQ5huEthJZD5GE8gkhgR2TBmeSSTvioqpNrsbV1BCufGKHJq1S7EEdfyh8Vl)

## 들어가며

어느 순간 느꼈던 거 같다. AI 세션을 새로 열때마다 이런 대화가 반복됐다.

<br>

> "우리 팀이 운영하는 서비스가 뭐가 있냐면..."
>
> "코드 저장소는 여기에 있고..."
>
> "아 그리고 배포할 때는 이 프로세스를 따라야 하는데..."

<br>

매번. 처음부터. 다시.

<br>

AI가 아무리 똑똑해도, 매 세션이 첫 출근이나 다름없다.

마치 3년차 동료에게 매일 아침 "저희 팀이 뭐 하는 팀인지 아세요?"라고 대화를 시작하는 것과 비슷하다.

<br>

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287204/00d48b8a-e593-45bb-940c-c4c2a1180caa" alt="매일 첫 출근하는 AI" width="454" />


</div>

<br>

나는 이 친구를 진짜 팀원으로 만들고 싶었다.

우리 팀이 어떤 서비스를 운영하는지, 코드가 어디에 있는지, 장애가 나면 어디부터 봐야 하는지

설명하지 않아도 이미 알고 있는, 그런 동료를 만들고 싶었다.

<br>

그리고 한 달이 지난 지금,

나는 어느새 방망이 깎던 노인처럼 매일 조금씩 하네스를 깎고 있다.

<br>

이건 "이게 정답이다"라는 글이 아니다.

<br>

다만 이렇게 깎아가면서 얻은 결과가 꽤 긍정적이고, **깎을수록 AI가 정말로 팀원처럼 일하기 시작했다고 확실히 말할 수 있다.**

## 1\. 구조를 깎다

처음엔 뭘 깎는다는 생각을 못했다.

파일 하나에 서비스 목록, 코드 저장소, 운영성 작업, 배포 프로세스를 쭉 적어넣으면 끝인 줄 알았다.

<br>

며칠은 그랬다.

<br>

그런데 "이것도 적어야지", "이것도 빠지면 안 돼"를 반복하다 보니 파일이 500줄을 넘겼다.

<br>

맙소사 배포 프로세스 하나 물어보는데 AI가 500줄을 처음부터 읽는다.

<br>

작업대 서랍 하나에 끌, 망치, 대패, 사포, 도면까지 전부 넣어둔 격이다.

끌 하나 꺼내려면 매번 서랍을 다 뒤져야 한다.

<br>

그래서 원칙 하나를 세웠다.

<br>

> <strong><span style="color: rgb(74, 144, 217);">정보</span></strong>를 저장하는 게 아니라, <strong><span style="color: rgb(74, 144, 217);">정보를 찾는 방법</span></strong>을 저장한다.

<br>

500줄, 1000줄짜리 백과사전 대신, 목차만 남기는 거다.

<br>

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287205/7134d89f-744b-408b-b499-dc028ab2221a" alt="한 파일에 전부 vs 목차만 남기고 나누기" height="320" />


</div>

그리고 자연스럽게 다음 고민이 생겼다. 

**"어떤 기준으로 나누지?"**

<br>

새 지식은 매일 들어온다.

문제는 그걸 어디에 기록할지가 명확하지 않다는 거다.

<br>

자리가 모호하면 같은 내용이 여러 곳에 생기고, 시간이 지나면 내용이 미묘하게 달라진다.

그렇게 되면 <strong><span style="color: rgb(192, 0, 0);">AI조차 "이건 어디에 넣어야 하죠?"라고 되묻기 시작한다.</span></strong>

<br>

결국 나눈다는 행동 자체보다 **어떤 기준으로 나누는지**가 더 중요했다.

<br>

> 지식을 가져오는 건 쉽다. 진짜 어려운 건 <strong><span style="color: rgb(0, 112, 192);">그걸 어떻게 기록하는지</span></strong>다.

<br>

나는 나만의 기준으로 지식을 담기 시작했다.

물론 서랍의 구조는 여러번 바뀌었다.

<br>

한 달간 반복한 결과, 지금 내 하네스는 이런 모양이 됐다.

<br>

<table><colgroup><col></colgroup><tr><td style="background-color: rgb(30, 30, 30)">

<span style="color: rgb(220, 220, 170);">nhn-cloud-notification/</span>

├── <span style="color: rgb(206, 145, 120);">CLAUDE.md</span>                 <span style="color: rgb(106, 153, 85);"># 진입점 (목차)</span>

├── <span style="color: rgb(156, 220, 254);">handbook/</span>                  <span style="color: rgb(106, 153, 85);"># 팀 지식 (서비스 무관)</span>

│   ├── <span style="color: rgb(156, 220, 254);">who/</span>                     <span style="color: rgb(106, 153, 85);"># 사람,팀</span>

│   ├── <span style="color: rgb(156, 220, 254);">where/</span>                   <span style="color: rgb(106, 153, 85);"># 환경,도구</span>

│   └── <span style="color: rgb(156, 220, 254);">how/</span>                     <span style="color: rgb(106, 153, 85);"># 프로세스,컨벤션</span>

├── <span style="color: rgb(156, 220, 254);">services/</span>                  <span style="color: rgb(106, 153, 85);"># 서비스별 지식</span>

│   ├── <span style="color: rgb(156, 220, 254);">\_common/</span>                  <span style="color: rgb(106, 153, 85);"># 여러 서비스 공통</span>

│   ├── <span style="color: rgb(156, 220, 254);">sms/</span>

│   │   ├── <span style="color: rgb(156, 220, 254);">spec/</span>                 <span style="color: rgb(106, 153, 85);"># 정책·상태값</span>

│   │   ├── <span style="color: rgb(156, 220, 254);">internals/</span>            <span style="color: rgb(106, 153, 85);"># 코드 위치 지도</span>

│   │   ├── <span style="color: rgb(156, 220, 254);">architecture/</span>         <span style="color: rgb(106, 153, 85);"># 기능 흐름도</span>

│   │   └── <span style="color: rgb(156, 220, 254);">operations/</span>           <span style="color: rgb(106, 153, 85);"># 운영 매뉴얼</span>

│   ├── <span style="color: rgb(156, 220, 254);">notification-hub/</span>

│   ├── <span style="color: rgb(156, 220, 254);">email/</span>

│   ├── <span style="color: rgb(156, 220, 254);">ktb/</span>

│   ├── <span style="color: rgb(156, 220, 254);">push/</span>

│   └── <span style="color: rgb(136, 136, 136);">...</span>

├── <span style="color: rgb(156, 220, 254);">history/</span>                   <span style="color: rgb(106, 153, 85);"># 기록</span>

│   ├── <span style="color: rgb(156, 220, 254);">work-log/</span>

│   ├── <span style="color: rgb(156, 220, 254);">decisions/</span>

│   ├── <span style="color: rgb(156, 220, 254);">incidents/</span>

│   └── <span style="color: rgb(220, 220, 170);">harness-backlog/</span>

├── <span style="color: rgb(156, 220, 254);">repos/</span>                     <span style="color: rgb(106, 153, 85);"># 코드 저장소</span>

└──<span style="color: rgb(156, 220, 254);">scripts/</span>                   <span style="color: rgb(106, 153, 85);"># 자동화 스크립트</span>

</td></tr></table>

구조가 잡히니 AI가 나에게 되묻는 일이 줄었다.

같은 내용이 두 군데 생기지 않으니 "A 문서와 B 문서 내용이 다른데 어느 쪽이 맞나요?" 같은 되물음도 사라졌다.

<br>

찾을 때도 전부 뒤지지 않고 목차를 보고 필요한 서랍만 연다.

<br>

**매일 첫 출근하던 친구가, 이제 자기 자리를 안다.**

<br>

그래서 나는 하네스 깎는 노인이 된 거다.

<br>

> 결국 구조의 진짜 가치는 <strong><span style="color: rgb(74, 144, 217);">정보가 어디에 있지?</span></strong> 보다
>
> <strong><span style="color: rgb(74, 144, 217);">새 정보를 어디에 쌓지?</span></strong> 를 명확하게 만드는 것이다.

## 2\. 기록을 남기다

매일 나무를 깎다 보면 어느 순간 이런 생각이 든다.

"이 부분을 내가 깎았나?" "여기를 왜 이 각도로 깎았더라?"

<br>

어제의 내가 분명히 이유가 있어서 깎았을 텐데, 오늘의 나는 그 이유를 모른다. 

**<span style="color: rgb(217, 83, 79);">깎은 자리는 남아있는데 의도가 사라진 거다.</span>**

<br>

AI는 이게 더 심하다. 세션이 바뀌면 아예 백지다.

그래서 기록을 남기기 시작했다.

<br>

한 달쯤 되니까 이 세 가지 기록이 자연스럽게 자리잡았다.

<br>

<table><colgroup><col></colgroup><tr><td style="background-color: rgb(30, 30, 30)">

<span style="color: rgb(136, 136, 136);">history/</span>

├── <span style="color: rgb(156, 220, 254);">work-log/</span>          <span style="color: rgb(106, 153, 85);"># 어떤 작업을 어떻게 진행 했는가</span>

├── <span style="color: rgb(156, 220, 254);">decisions/</span>         <span style="color: rgb(106, 153, 85);"># 어떤 결정이 왜 내려졌는가</span>

├── <span style="color: rgb(156, 220, 254);">incidents/</span>         <span style="color: rgb(106, 153, 85);"># 어떤 실수가 있었는가</span>

└──<span style="color: rgb(220, 220, 170);">harness-backlog/</span>  <span style="color: rgb(106, 153, 85);"># AI가 제안, 반영은 내가</span>

</td></tr></table>

> **<span style="color: rgb(68, 114, 196);">기록이 쌓이면 재밌는 일이 생긴다.</span>**

깎은 자국의 기록을 하나하나 남겨뒀더니, 도구가 손의 기억을 갖기 시작했다.

비슷한 나뭇결을 만나면 "이건 저번에 이 방향이 맞았어"라고 먼저 말한다.

<br>

작업 기록을 10건 쌓아두니까 11번째부터는 스스로 새로운 업무도 기존 스타일에 맞게 진행한다.

사고 기록을 남겨두니까 같은 유형의 위험한 상황에서 알아서 멈춘다.

<br>

그렇게 이 마법같은 선순환 루프가 만들어졌다.

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287206/ad0ef275-ee1d-4c7d-8846-1462ba5ded10" alt="선순환 루프" height="320" />


</div>

<br>

모든게 완벽한거 같았다.

<br>

그런데 이 루프에는 <strong><span style="color: rgb(192, 0, 0);">치명적인 함정</span></strong>이 있다.

<br>

"AI가 일을 하다가 실수를 하면, 사고 기록에 남기고 다음에 반복하지 않도록 가드를 세우고 자동으로 harness를 업데이트한다."

여기까지는 좋다.

<br>

문제는 **AI가 자신의 답변이 실수인 줄 모르는 경우**다.

틀린 답변을 하고 나서 "이건 좋은 지식이니까 하네스에 반영해야지"라고 스스로 판단해버린다.

<br>

**<span style="color: rgb(217, 83, 79);">오답이 정답 행세를 하는 거다.</span>**

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287207/d57c9d00-0f80-43e6-a31a-1da20d4394ef" alt="AI가 틀린 지식을 harness에 반영하려는 모습" width="460" />


</div>

그래서 규칙을 하나 만들었다. 

<br>

<strong><span style="color: rgb(74, 144, 217);">AI가 제안하고, 반영은 내가 한다.</span></strong> 

<br>

AI가 "이건 하네스에 반영하면 좋겠다"고 판단한 것들을 자동으로 반영하지 않고, 일단 backlog에 쌓는다. 

최종적으로 깎아넣을지 말지는 내가 확인하고 결정한다.

<br>

실제로 쌓이는 백로그는 이런 형태다.

<br>

```markdown
---
date: 2026-05-18
time: "18:47"
title: KTB 과금 기준 (알림톡 1종, 친구톡 8종, 브랜드메시지 16종)
type: new-policy
service: KTB
source: inquiry
status: pending
---
## 내용
KTB 과금 정책 요약:
**과금 시점**: 카카오 발송 성공 건만 과금. 발송 실패(9999 등)는 미과금. "요청 시"가 아니라 "발송 성공 시" 과금.
...
```

<br>

이 구조가 말해주는 건 단순하다.

<br>

> 결국 하네스를 깎는건 <strong><span style="color: rgb(68, 114, 196);">도구</span></strong>가 아니라 <strong><span style="color: rgb(68, 114, 196);">사람</span></strong>이다

<br>

AI는 좋은 끌이지만, 어디를 깎을지 결정하는 건 결국 나무를 매일 만져온 사람의 몫이다.

<br>

물론 언젠가 더 이상 깎지 않아도 되는 날이 올지도 모른다.

도구가 스스로 판단하고, 스스로 검증하고, 스스로 기록하는 날.

<br>

그때가 오면 노인은 마당에 앉아 나무 방망이를 그냥 바라보기만 하면 될 거다.

<br>

하지만 아직은 아니다.

## 3\. 규칙을 세우다

혹시 아이한테 "위험하니까 만지지 마"라고 말해본 적 있는가.

안 만진다. 잠깐은. 근데 결국엔 만진다.

AI도 비슷하다.

<br>

처음에 하네스에 이런 규칙을 적어두었다.

**"모든 작업은 반드시 확인을 받고 실행해라."**

<br>

문제는 <strong><span style="color: rgb(192, 0, 0);">맥락이 복잡해지면 무시해버린다</span></strong><span style="color: rgb(13, 13, 13);">는거다</span>

실제로 사고가 났다. 확인 없이 실행된 작업이 의도하지 않은 결과를 만들었다.

<br>

그렇다면 "하지 마"가 안 통할때 어떻게 해야 할까.

답은 단순하다.

<br>

**<span style="color: rgb(74, 144, 217);">하고싶어도 불가능하게 만들면 된다.</span>**

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287208/4901090d-2559-4fff-b17a-58aff7e4a3b2" alt="soft 가드레일 vs hard 가드레일" width="538" />


</div>

시행착오를 겪으며 규칙이 총 3개 레이어로 수립됐다.

Soft -> Hard 로 가는 순이다.

<br>

| 층 | 방식 | 예시 |
| :--- | :--- | :--- |
| **프롬프트 텍스트 규칙** | 하네스에 "하지 마"라고 적는다 | "응답 전에 출처를 확인해라" |
| **구조적 강제** | 특정 스크립트를 돌린 결과만으로 동작하게 만든다 | 응답 전송은 검증 스크립트를 통해서만 가능 |
| **권한 차단** | 권한 제거 | 쓰기 권한 자체를 제거 |

층마다 실제로 어떻게 막히는지 보자.

### 1층. 텍스트 규칙

처음엔 하네스에 이렇게 적어두는 것으로 충분하다고 생각했다.

```text
DB는 SELECT만 실행한다.
INSERT, UPDATE, DELETE는 직접 실행하지 말고 나에게 쿼리를 제시해라.
```

### 2층. 구조적 강제

그래서 통로를 하나로 줄였다.

DB에 닿는 길을 스크립트 하나로 고정하고, AI는 그 스크립트만 쓰게 했다.

```bash
echo "SELECT ... LIMIT 20;" | bash scripts/db-query.sh sms
```

접속 정보는 스크립트 안에 있고, AI는 쿼리만 넘긴다.

어디에 붙을지는 AI가 정하지 못한다.

### 3층. 권한 차단

마지막 층은 단순하다. **애초에 write가 불가능한 계정을 준다.**

```bash
AI > UPDATE foo_table SET status='01' WHERE ...

ERROR 1290 (HY000): The MySQL server is running with the
--read-only option so it cannot execute this statement

// 시도는 자유. 실행은 불가.
```

<br>

"하지 마"라고 100번 적는 것보다, 도구 목록에서 한 줄 빼는 게 확실하다.

부엌에 있는 아이에게 칼 만지지마 라고하는거보다 부엌에서 칼을 빼놓는게 확실한것처럼 말이다.

<br>

규칙은 AI를 잘 사용하기 위해서 세우는 게 아니다.

<br>

실수가 발생했을 때 피해가 어디까지 갈 수 있는지를 미리 제한해두는거다.

## 4\. 은총알(Silver Bullet)은 없다

한 달간 깎으면서 가장 강하게 느낀 점이다.

<br>

세상에는 이미 좋은 가구가 많다.

"harness 자동 구축 에이전트", "프로젝트를 분석해서 한 번에 harness를 만들어주는 도구", "best practice 템플릿" 등등.

분명 잘 만들어져 있다.

<br>

하지만 아무리 좋아보인는 의자를 사도, 그 의자가 내 엉덩이에 맞을지는 별개의 문제다.

<br>

왜냐하면 하네스의 가치는 "무엇이 적혀있는가"보다 <strong><span style="color: rgb(0, 112, 192);">"왜 이렇게 적혀있는가"</span></strong>에 있기 때문이다. 

<br>

"왜 이 디렉토리가 이렇게 나뉘어 있는지"

"왜 이 규칙이 여기에 있는지"

<br>

이 "왜"는 시행착오를 겪은 사람만 안다.

<br>

누군가가 완성된 하네스를 갖다줘도, <strong><span style="color: rgb(0, 112, 192);">"왜"가 빠진 하네스는 처음 보는 사람의 작업복</span></strong>이다.

<br>

입을 수는 있지만 어딘가 불편하다.

<div data-dooray-align-container style="text-align: center">

<img src="https://whatsup.nhnent.com/owfs/read/287209/8e5d81cf-2ac0-4221-8181-d31c6d8cd04d" alt="One Size Fits All 작업복" height="320" />


</div>

결국 내 손에 맞는 하네스는 내가 깎을 수밖에 없다.

<br>

한 번 깎아놓는다고 끝나는게 아니다, 업무가 진행되고 서비스가 배포되고 논의가 진행되면서 계속해서 깎아야 한다.

<br>

> 결국 하루 아침에 완성되는 <strong><span style="color: rgb(74, 144, 217);">은총알(silver bullet)</span></strong>은 없다.

<br>

있는 건 매일 조금씩 더 정교하게 깎이는 나무 조각뿐이다.

## 맺으며

몇달 전의 나는 "AI가 코드나 잘 짜주면 되지, 뭘 이렇게까지"라고 생각했을 것이다.

<br>

지금의 나는 매일 아침 하네스를 열어보고 "어제 이 부분이 좀 어색했으니 다듬어야겠다"고 생각하는 사람이 됐다.

<br>

언제부터 이렇게 됐는지 모르겠지만, 마당에 앉아 방망이를 깎는 노인의 심정을 조금은 알 것 같다.

<br>

> AI 도구의 성능은 <strong><span style="color: rgb(74, 144, 217);">모델</span></strong>이 결정하지만, 활용의 깊이는 <strong><span style="color: rgb(74, 144, 217);">맥락</span></strong>이 결정한다.

<br>

그리고 그 맥락은 누군가 한 번에 만들어주는 게 아니라, 내가 업무를 하면서 조금씩 쌓고, 실수하면서 다듬고, 구조가 어색해지면 깎아서 맞추는 것이다

<br>

시작은 파일 하나면 충분하다. 거기서부터 깎기 시작하면 된다.

<br>

그러다보면 아마, 나처럼 어느 순간 깎는 게 좀 재밌어질 거다.
