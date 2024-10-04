# 블록스토리지 API 가이드

## Block Storage API 공통 정보

**Storage > Block Storage > API 가이드 > Block Storage API 공통 정보**

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

WARNING: Installing an MkDocs plugin means installing a Python package and executing any code that the author has put in there. So, exercise the usual caution; there's no attempt at sandboxing.

> NEW: **New in version 1.4.**
>
> ##### Subclassing `Config` to specify the config schema
>
> To get type safety benefits, if you're targeting only MkDocs 1.4+, define the config schema as a class instead:
>
> ```python
> class MyPluginConfig(mkdocs.config.base.Config):
>     foo = mkdocs.config.config_options.Type(str, default='a default value')
>     bar = mkdocs.config.config_options.Type(int, default=0)
>     baz = mkdocs.config.config_options.Type(bool, default=True)
>
> class MyPlugin(mkdocs.plugins.BasePlugin[MyPluginConfig]):
>     ...
> ```
>

## 블록 스토리지 타입 목록 보기

블록 스토리지 타입의 목록을 조회합니다.

### 요청

```
GET /v2/{tenantId}/types
X-Auth-Token: {tokenId}
```

### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| tokenId | Header | String | Y | 토큰 ID |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.


### 응답

<details><summary>JSON</summary>
<p>

```json
{
  "volume_types": [
    {
      "os-volume-type-access:is_public": true,
      "extra_specs": {
        "volume_backend_name": "ssd_general"
      },
      "id": "4e36aa51-df30-422e-aff1-eba1f3d9612f",
      "name": "General SSD",
      "description": null
    },
    {
      "os-volume-type-access:is_public": true,
      "extra_specs": {
        "volume_backend_name": "hdd_general"
      },
      "id": "6bda35e2-b2b9-497a-8f65-67a73839c856",
      "name": "General HDD",
      "description": null
    }
  ]
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|
| volume_types | Array | 블록 스토리지 타입 객체 목록 |
| volume_types.id |  UUID | 블록 스토리지 타입 ID |
| volume_types.name | String | 블록 스토리지 타입 이름 |
| volume_types.os-volume-type-access:is_public | Boolean | 블록 스토리지 타입 공개 여부 |
| volume_types.description |  String | 블록 스토리지 타입 설명 |
| volume_types.extra_specs |  Object | 블록 스토리지 타입 관련 추가 사양 정보 객체 |








