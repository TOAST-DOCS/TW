# 블록 스토리지 타입

## Storage > Block Storage > API 가이드 > 블록 스토리지 타입

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

