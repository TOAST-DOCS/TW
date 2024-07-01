# 스냅숏
## 스냅숏 상태

스냅숏은 다양한 상태를 가지며, 상태에 따라 취할 수 있는 동작이 정해져 있습니다. 가능한 상태 목록은 다음과 같습니다.

| 상태 명 | 설명                      |
|--|-------------------------|
| `creating` | 생성 중인 상태                |
| `available` | 스냅숏이 생성되어 사용할 준비가 된 상태  |
| `backing-up`| 스냅숏이 백업 중인 상태           |
| `deleting`| 스냅숏이 삭제 중인 상태           |
| `error`| 생성 중 오류가 발생한 상태         |
| `deleted`| 삭제된 상태                  |
| `unmanaging`| 스냅숏에 대한 관리 모드가 해제 중인 상태 |
| `restoring`| 스냅숏으로부터 블록 스토리지를 복원 중인 상태    |
| `error_deleting`| 삭제 중 오류가 발생한 상태         |

## 스냅숏 목록 보기

스냅숏 목록을 반환합니다.

## 요청

```
GET /v2/{tenantId}/snapshots
X-Auth-Token: {tokenId}
```

### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| tokenId | Header | String | Y | 토큰 ID |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.

## 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "snapshots": [
    {
      "status": "available",
      "description": "",
      "created_at": "2020-03-03T11:03:40.000000",
      "metadata": {},
      "volume_id": "17975e9d-1533-40db-bd02-2072cd2ccb7f",
      "size": 50,
      "id": "f63af601-43cd-41ab-8905-e1e93995f366",
      "name": "SNAPSHOT"
    }
  ]
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|---|
| snapshots | Array | 스냅숏 정보 객체 목록 |
| snapshots.status | Enum | 스냅숏 상태 |
| snapshots.description | String | 스냅숏 설명 |
| snapshots.created_at | Datetime | 스냅숏 생성 시간<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| snapshots.metadata | Object | 스냅숏 메타데이터 객체 |
| snapshots.volume_id | UUID | 스냅숏의 원본 블록 스토리지 ID |
| snapshots.size | Integer | 스냅숏의 원본 블록 스토리지 크기(GB) |
| snapshots.id | UUID | 스냅숏 ID |
| snapshots.name | String | 스냅숏 이름 |

## 스냅숏 목록 상세 보기

스냅숏 상세 정보 목록을 반환합니다.

## 요청

```
GET /v2/{tenantId}/snapshots/detail
X-Auth-Token: {tokenId}
```

### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| tokenId | Header | String | Y | 토큰 ID |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.

## 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "snapshots": [
    {
      "status": "available",
      "os-extended-snapshot-attributes:progress": "100%",
      "description": "",
      "created_at": "2020-03-03T11:03:40.000000",
      "metadata": {},
      "volume_id": "17975e9d-1533-40db-bd02-2072cd2ccb7f",
      "os-extended-snapshot-attributes:project_id": "6cdebe3eb0094910bc41f1d42ebe4cb7",
      "size": 50,
      "id": "f63af601-43cd-41ab-8905-e1e93995f366",
      "name": "SNAPSHOT"
    }
  ]
}
```

</p>
</details>


| 이름 | 타입 | 설명 |
|---|---|---|---|
| snapshots | Array | 스냅숏 상세 정보 객체 목록 |
| snapshots.status | Enum | 스냅숏 상태 |
| snapshots.description | String | 스냅숏 설명 |
| snapshots.os-extended-snapshot-attributes:progress | String | 스냅숏 생성 진행 상태 |
| snapshots.created_at | Datetime | 스냅숏 생성 시간<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| snapshots.metadata | Object | 스냅숏 메타데이터 객체 |
| snapshots.volume_id | UUID | 스냅숏의 원본 블록 스토리지 ID |
| snapshots.os-extended-snapshot-attributes:project_id | String | 테넌트 ID |
| snapshots.size | Integer | 스냅숏의 원본 블록 스토리지 크기(GB) |
| snapshots.id | UUID | 스냅숏 ID |
| snapshots.name | String | 스냅숏 이름 |

### 스냅숏 보기

지정한 스냅숏의 상세 정보를 반환합니다.


## 요청

```
GET /v2/{tenantId}/snapshots/{snapshotId}
X-Auth-Token: {tokenId}
```
### 요청 파라미터 

| 이름 | 구분| 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| snapshotId | URL | UUID | Y | 스냅숏 ID |
| tokenId | Header | String | Y | 토큰 ID |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.

## 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "snapshot": {
    "status": "available",
    "os-extended-snapshot-attributes:progress": "100%",
    "description": "",
    "created_at": "2020-03-03T11:03:40.000000",
    "metadata": {},
    "volume_id": "17975e9d-1533-40db-bd02-2072cd2ccb7f",
    "os-extended-snapshot-attributes:project_id": "6cdebe3eb0094910bc41f1d42ebe4cb7",
    "size": 50,
    "id": "f63af601-43cd-41ab-8905-e1e93995f366",
    "name": "SNAPSHOT"
  }
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|---|
| snapshot | Object | 스냅숏 상세 정보 객체 |
| snapshot.status | Enum | 스냅숏 상태 |
| snapshot.description | String | 스냅숏 설명 |
| snapshot.os-extended-snapshot-attributes:progress | String | 스냅숏 생성 진행 상태 |
| snapshot.created_at | Datetime | 스냅숏 생성 시간<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| snapshot.metadata | Object | 스냅숏 메타데이터 객체 |
| snapshot.volume_id | UUID | 스냅숏의 원본 블록 스토리지 ID |
| snapshot.os-extended-snapshot-attributes:project_id | String | 테넌트 ID |
| snapshot.size | Integer | 스냅숏의 원본 블록 스토리지 크기(GB) |
| snapshot.id | UUID | 스냅숏 ID |
| snapshot.name | String | 스냅숏 이름 |


## 스냅숏 생성하기

지정한 블록 스토리지의 스냅숏을 생성합니다.

## 요청

```
POST /v2/{tenantId}/snapshots
X-Auth-Token: {tokenId}
```

### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명                                        |
|---|---|---|---|-------------------------------------------|
| tenantId | URL | String | O | 테넌트 ID                                    |
| tokenId | Header | String | O | 토큰 ID                                     |
| snapshot | Body | Object | O | 스냅숏 생성 요청 객체                              |

### 요청 본문

<details><summary>JSON</summary>
<p>

```json
{
    "snapshot": {
        "name": "SNAPSHOT-001",
        "description": "Daily backup",
        "volume_id": "5aa119a8-d25b-45a7-8d1b-88e127885635",
        "force": true
    }
}
```

</p>
</details>

| 이름 | 구분 | 타입 | 필수 | 설명                                        |
|---|---|---|---|-------------------------------------------|
| snapshot.volume_id | Body | UUID | Y | 원본 블록 스토리지 ID                                  |
| snapshot.force | Body | Boolean | N | 강제 스냅숏 생성 여부<br>`true`면 블록 스토리지가 연결되어도 스냅숏을 생성 |
| snapshot.description | Body | String | N | 스냅숏 설명                                    |
| snapshot.name | Body | String | N | 스냅숏 이름                                    |


## 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "snapshot": {
    "status": "creating",
    "description": null,
    "created_at": "2020-03-02T13:51:33.318695",
    "metadata": {},
    "volume_id": "5aa119a8-d25b-45a7-8d1b-88e127885635",
    "size": 20,
    "id": "f2ae2667-b3b7-47ef-aa31-efab536888b9",
    "name": "SNAPSHOT"
  }
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|---|
| snapshot | Object | 스냅숏 상세 정보 객체 |
| snapshot.status | Enum | 스냅숏 상태 |
| snapshot.description | String | 스냅숏 설명 |
| snapshot.created_at | Datetime | 스냅숏 생성 시간<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| snapshot.metadata | Object | 스냅숏 메타데이터 객체 |
| snapshot.volume_id | UUID | 스냅숏의 원본 블록 스토리지 ID |
| snapshot.size | Integer | 스냅숏의 원본 블록 스토리지 크기(GB) |
| snapshot.id | UUID | 스냅숏 ID |
| snapshot.name | String | 스냅숏 이름 |

## 스냅숏 삭제하기

지정한 스냅숏을 삭제합니다.

## 요청

```
DELETE /v2/{tenantId}/snapshots/{snapshotId}
X-Auth-Token: {tokenId}
```
### 요청 파라미터 

| 이름 | 종류 | 형식 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | O | 테넌트 ID |
| snapshotId | URL | String | O | 스냅숏 ID |
| tokenId | Header | String | O | 토큰 ID |

### 요청 본문 

이 API는 요청 본문을 요구하지 않습니다.

#### 응답

이 API는 응답 본문을 반환하지 않습니다.