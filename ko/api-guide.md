# Block Storage API 공통 정보

## Storage > Block Storage > API 가이드 > Block Storage API 공통 정보

### API 엔드포인트

API를 사용하려면 API 엔드포인트와 토큰 등이 필요합니다. [API 사용 준비](/Compute/Compute/ko/identity-api/)를 참고하여 API 사용에 필요한 정보를 준비합니다.
블록 스토리지 API는 `volumev2` 타입 엔드포인트를 이용합니다. 정확한 엔드포인트는 토큰 발급 응답의 `serviceCatalog`를 참조합니다.

| 타입 | 리전 | 엔드포인트 |
|---|---|---|
| volumev2 | 한국(판교) 리전<br>한국(평촌) 리전<br>일본 리전 | https://kr1-api-block-storage-infrastructure.nhncloudservice.com<br>https://kr2-api-block-storage-infrastructure.nhncloudservice.com<br>https://jp1-api-block-storage-infrastructure.nhncloudservice.com |

API 응답에 가이드에 명시되지 않은 필드가 나타날 수 있습니다. 이런 필드는 NHN Cloud 내부 용도로 사용되며 사전 공지 없이 변경될 수 있으므로 사용하지 않습니다.

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

## 오류 코드

| 오류 코드 | 오류 메시지 | 설명 |
| --- | --- | --- |
| 0 | Success  | 처리 성공 |
| -1 | Fail  | 처리 실패 |
| -2| Assert | 처리 실패 |
| 10000| boolean | 존재하지 않는 서비스입니다. |

