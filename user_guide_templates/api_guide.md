API 가이드는 API를 사용하기위해 필요한 API 엔드포인트, HTTP 메서드, 요청 및 응답 형식, 인증 프로세스, 오류 처리에 대한 정보를 담고 있습니다.

* 아래 템플릿을 사용하기 [공통 작성 가이드](https://nhnent.dooray.com/share/pages/1DKIunlqRX6z16RZvxSGbg)를 참고합니다.
* `{  }` 로 표시된 부분에 작성할 내용을 입력합니다.
* 타깃 독자는 NHN Cloud를 사용하는 개발자, 엔지니어, 기획자 등 클라우드 기술 및 개발에 대한 일정 수준 이상의 지식이 있는 사용자로 설정하며, 사용자가 특정 목적 행동을 달성하는 데 필요한 정보를 최대한 자세하고 구체적으로 작성합니다.
* 가이드 작성 템플릿은 가이드에 반드시 포함해야 할 내용의 최소 기준입니다. 템플릿에서 제시하고 있는 내용 외에 서비스별로 더 필요한 내용이 있다면 자유롭게 추가할 수 있습니다.
* 자세한 내용은 [NHN Cloud 가이드 문서 템플릿 활용 가이드](https://nhnent.dooray.com/share/pages/zzvZY-57RG6imxkuc_-blA)를 참고하여 작성합니다.
* 본 템플릿이 적용된 예는 [Block Storage API 가이드](https://docs.alpha-nhncloud.com/ko/Open%20Source/TW/ko/api-guide/) 샘플 페이지를 참고할 수 있습니다.

***

# {서비스명} API 가이드 (예: Instance API 가이드)

## {서비스명} API 공통 정보

**{최상위 메뉴(카테고리)} > {상위 메뉴(서비스명)} >{현재 페이지}**

### API 엔드포인트

{API를 호출하기 위한 리전명과 호출 도메인에 관한 내용을 적습니다. 마크다운 문법을 적용하지 않은 평문 스타일로 작성합니다.}

| 리전 | 엔드포인트 |
| --- | ----- |
|  |  |
|  |  |
|  |  |

### 인증 및 권한

{API를 사용하기 위해 필요한 인증 및 권한에 관한 내용을 작성합니다.}

### 응답 공통 정보

{본문을 입력하세요.}

<details>
  <summary><strong>성공 응답</strong></summary>

```
{코드 입력}
```

</details>

<details>
  <summary><strong>실패 응답</strong></summary>

```
{코드 입력}
```

</details>

| 이름 | 타입 | 설명 |
| --- | --- | --- |
|  |  |  |
|  |  |  |

---

## {API명(예: 인스턴스 목록 보기)}

{API의 동작을 간략하게 설명합니다. 예를 들어 '인스턴스 목록을 조회합니다.'}

!!! tip "알아두기"
<!-- API를 사용할 때 사용자가 알아 두면 좋을 참고 사항이나 추가 정보를 제공할 때 사용합니다.-->

!!! warning "주의"
<!--API를 사용할 때 따르지 않을 경우 서비스의 비정상 또는 비효율적 동작이 발생할 수 있는 주의 사항을 표기할 때 사용합니다.-->

### 요청

```
<!--HTTP 메서드와 URI를 적습니다.-->
(예: GET /v2/{tenantId}/servers)
```

### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| {파리미터명을 입력하세요} | {첫글자는 대문자로 입력하세요(예: Header, URL)} | {첫글자는 대문자로 입력하세요(예: String, Boolean)} | {Y or N} | {명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |  |  |

### 요청 본문

<!--요청 본문을 요구하지 않는다면 "이 API는 요청 본문을 요구하지 않습니다"로 입력합니다.-->

<details>
  <summary><strong>HTTP</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Java</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Python</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>JSON</strong></summary>

```

{코드 입력}
```

</details>

<!--요청 본문의 필드를 설명합니다.-->

| 이름 | 구분 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| {파리미터명을 입력하세요} | {첫글자는 대문자로 입력하세요(예: Header, URL)} | {첫글자는 대문자로 입력하세요(예: String, Boolean)} | {Y or N} | {명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |  |  |

### 응답

<!--응답 본문을 반환하지 않는다면 "이 API는 응답 본문을 반환하지 않습니다"로 입력합니다.-->
 
<details>
  <summary><strong>HTTP</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Java</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Python</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>JSON</strong></summary>

```

{코드 입력}
```

</details>
<!--응답 본문의 필드를 설명합니다.-->

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| {필드명을 입력하세요} | {첫글자는 대문자로 입력하세요(예: String, Boolean)} | {명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |

***

## {API 명(예: 인스턴스 상세 보기)}

{API의 동작을 간략하게 설명합니다. 예를 들어 '인스턴스의 세부 정보를 조회합니다.'}

!!! tip "알아두기"
<!-- API를 사용할 때 사용자가 알아 두면 좋을 참고 사항이나 추가 정보를 제공할 때 사용합니다.-->

!!! warning "주의"
<!--API를 사용할 때 따르지 않을 경우 서비스의 비정상 또는 비효율적 동작이 발생할 수 있는 주의 사항을 표기할 때 사용합니다.-->

### 요청

```
<!--HTTP 메서드와 URI를 적습니다.-->
(예: GET /v2/{tenantId}/servers)
```

### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| {내용 입력} | {내용 입력}<br>{첫글자는 대문자로 입력하세요(예: Header, URL)} | {내용 입력}<br>{첫글자는 대문자로 입력하세요(예: String, Boolean)} | {Y or N} | {내용 입력}<br>{명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |  |  |

### 요청 본문

<!--요청 본문을 요구하지 않는다면 "이 API는 요청 본문을 요구하지 않습니다"로 입력합니다.-->

<details>
  <summary><strong>HTTP</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Java</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>Python</strong></summary>

```

{코드 입력}
```

</details>

<details>
  <summary><strong>JSON</strong></summary>

```

{코드 입력}
```

</details>

<!--요청 본문의 필드를 설명합니다.-->

| 이름 | 타입 | 필수 | 설명 |  |
| --- | --- | --- | --- | --- |
| {내용 입력} | {내용 입력}<br>{첫글자는 대문자로 입력하세요(예: Header, URL)} | {내용 입력}<br>{첫글자는 대문자로 입력하세요(예: String, Boolean)} | {Y or N} | {내용 입력}<br>{명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |  |  |

### 응답

<!--응답 본문을 반환하지 않는다면 "이 API는 응답 본문을 반환하지 않습니다"로 입력합니다.-->

<details>
  <summary><strong>응답 예시</strong></summary>

```

{코드 입력}
```

</details>

<!--응답 본문의 필드를 설명합니다.-->

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| {필드명을 입력하세요} | {첫글자는 대문자로 입력하세요(예: String, Boolean)} | {명사형 종결 형태로 입력하세요(예: 블록 스토리지 타입 설명} |
|  |  |  |
