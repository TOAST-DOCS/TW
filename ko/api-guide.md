# Instance API 가이드

## API 공통 정보

### API 엔드포인트

NHN Cloud 기본 인프라 서비스 API는 타입과 리전별로 엔드포인트가 나뉘어 있습니다. Instance 서비스의 리전과 엔드포인트는 다음과 같습니다.

| 리전 | 엔드포인트 |
| --- | ----- |
|한국(판교)리전  | https://kr1-api-instance-infrastructure.nhncloudservice.com |
|한국(평촌)리전  | https://kr2-api-instance-infrastructure.nhncloudservice.com  |
| 일본 리전 | https://jp1-api-instance-infrastructure.nhncloudservice.com |

### 인증 및 권한

NHN Cloud 기본 인프라 서비스 API 호출에 필요한 테넌트 ID와 토큰 등이 필요합니다. [API 사용 준비](https://docs.nhncloud.com/ko/Compute/Compute/ko/identity-api/)를 참고합니다.

### 응답 공통 정보

모든 API 요청 응답으로 HTTP 200 OK를 전달합니다. API 요청 성공 유무는 Response Body의 header 항목을 참고하여 판단할 수 있습니다.

<details>
  <summary><strong>성공 응답</strong></summary>

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "header": {
        "resultCode": 0,
        "resultMessage": "LEADERBOARD_OK",
        "isSuccessful": true
    },
    "transactionId": 2873495728794,
    ...
}
```
</details>

<details>
  <summary><strong>실패 응답</strong></summary>

```
{
    "header": {
        "isSuccessful": false,
        "resultCode": 404,
        "resultMessage": "Please check your API Url, HTTP Method."
    }
}
```

</details>

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| resultCode | int  | 응답 코드<br>성공 시 0, 실패시 오류 코드 반환 |
| resultMessage | String  | 응답 메시지 |
| isSuccessful | boolean | 성공 여부 |

## 가용성 영역

### 가용성 목록 보기

인스턴스의 가용성 목록을 조회합니다. 

#### 요청

```
GET /v2/{tenantId}/os-availability-zone
x-Autu-Token: {tokenID}
```

#### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| tenandId | URL | String | Y | 테넌트 ID |
| tokenId | Header | String | Y | 토큰 ID |

#### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.

### 응답

<!--응답 본문을 반환하지 않는다면 "이 API는 응답 본문을 반환하지 않습니다"로 입력합니다.-->

<details>
  <summary><strong>응답 예시</strong></summary>

```
{
    "availabilityZoneInfo": [
      {
        "zoneState": {
          "available": true
        },
        "zoneName": "kr-pub-a"
      },
      {
        "zoneState": {
          "available": true
        },
        "zoneName": "kr-pub-b"
      }
    ]
}
```

</details>

<!--응답 본문의 필드를 설명합니다.-->

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| availabilityZoneInfo | Object | 가용성 영역 정보 객체 |
| availabilityZoneInfo.zoneState  | Object  | 가용성 영역 상태 정보 객체  |
| availabilityZoneInfo.zoneName  | String | 가용성 영역 이름 |
| availabilityZoneInfo.available | Boolean | 가용성 영역 상태 |
***

### {API명(예: 인스턴스 상세 보기)}

{API의 동작을 간략하게 설명합니다. 예를 들어 '인스턴스의 세부 정보를 조회합니다.'}

> [알림]
>
> <!-- API를 사용할 때 사용자가 알아 두면 좋을 참고 사항이나 추가 정보를 제공할 때 사용합니다.-->

> [주의]
>
> <!--API를 사용할 때 따르지 않을 경우 서비스의 비정상 또는 비효율적 동작이 발생할 수 있는 주의 사항을 표기할 때 사용합니다.-->

> [경고]
>
> <!--API를 사용할 때 따르지 않을 경우 리소스나 데이터의 손실, 과도한 과금, 재산상 피해 등이 발생할 수 있는 경고 사항을 표기할 때 사용합니다.-->

#### 요청

```
<!--HTTP 메서드와 URI를 적습니다.-->
(예: GET /v2/{tenantId}/servers)
```

#### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| {내용 입력} | {내용 입력} | {내용 입력} | {Y or N} | {내용 입력} |
|  |  |  |  |  |

#### 요청 본문

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
  <summary><strong>JavaScript</strong></summary>

```

{코드 입력}
```

</details>

<!--요청 본문의 필드를 설명합니다.-->

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |

### 응답

<!--응답 본문을 반환하지 않는다면 "이 API는 응답 본문을 반환하지 않습니다"로 입력합니다.-->

<details>
  <summary><strong>응답 예시</strong></summary>

```

{코드 입력}
```

</details>

<!--응답 본문의 필드를 설명합니다.-->

| 필드 | 타입 | 설명 |
| --- | --- | --- |
|  |  |  |
|  |  |  |
