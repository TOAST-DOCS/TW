# 블록 스토리지

## Storage > Block Storage > API 가이드 > 블록 스토리지

## 블록 스토리지 상태
블록 스토리지는 다양한 상태를 가지며 상태에 따라 취할 수 있는 동작이 정해져 있습니다. 가능한 상태 목록은 다음과 같습니다.

| 상태 명 | 설명                         |
|--|----------------------------|
| `creating` | 생성 중인 상태                   |
| `available` | 블록 스토리지가 생성되어 연결할 준비가 된 상태      |
| `attaching`| 블록 스토리지가 인스턴스에 연결 중인 상태         |
| `detaching`| 블록 스토리지가 연결 해제 중인 상태            |
| `in-use`| 블록 스토리지가 인스턴스에 연결된 상태           |
| `reserved`| 종료된 인스턴스의 루트 블록 스토리지 상태         |
| `maintenance`| 블록 스토리지가 다른 호스트 장비로 이전 중인 상태    |
| `deleting`| 블록 스토리지를 삭제 중인 상태               |
| `awaiting-transfer`| 블록 스토리지가 전송을 기다리는 상태            |
| `error`| 블록 스토리지 생성 시 오류가 발생한 상태         |
| `error_deleting`| 블록 스토리지 삭제 시 오류가 발생한 상태         |
| `backing-up`| 블록 스토리지가 백업 중인 상태               |
| `restoring-backup`| 블록 스토리지가 백업본에서 복구 중인 상태         |
| `error_backing-up`| 백업 중 오류가 발생한 상태            |
| `error_restoring`| 복구 중 오류가 발생한 상태            |
| `error_extending`| 블록 스토리지 확장 중 오류가 발생한 상태         |
| `downloading`| 블록 스토리지 생성 시 지정한 이미지를 다운로드하는 상태 |
| `uploading`| 이미지 생성 시 블록 스토리지의 이미지를 업로드하는 상태 |
| `retyping`| 블록 스토리지 타입을 변경하는 상태             |
| `extending`| 블록 스토리지를 확장하는 상태                |

## 블록 스토리지 목록 보기

현재 테넌트에 속한 블록 스토리지 목록을 반환합니다.

### 요청

```
GET /v2/{tenantId}/volumes
X-Auth-Token: {tokenId}
```
### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명                                                                                               |
|---|---|---|---|--------------------------------------------------------------------------------------------------|
| tenantId | URL | String | Y | 테넌트 ID                                                                                           |
| tokenId | Header | String | Y | 토큰 ID                                                                                            |
| sort | Query | String | N | 정렬 기준이 될 블록 스토리지 필드 이름<br>`< key >[: < direction > ]` 형태로 기술<br>예) `name:asc`, `created_at:desc` |
| limit | Query | Integer | N | 반환할 블록 스토리지 개수<br>기본값은 1000으로 설정                                                                 |
| offset | Query | Integer | N | 반환할 목록의 시작점<br>전체 목록 중 오프셋(offset) 번째 블록 스토리지부터 반환                                               |
| marker | Query | UUID | N | 반환할 블록 스토리지의 직전 블록 스토리지 ID<br>정렬 순서에 따라 `marker`로 지정된 블록 스토리지 이후부터 `limit` 만큼 반환                 |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.


### 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "volumes": [
    {
      "id": "90712f4f-2faa-4e4f-8eb1-9313a8595570",
      "links": [
        {
          "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/v2/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/90712f4f-2faa-4e4f-8eb1-9313a8595570",
          "rel": "self"
        },
        {
          "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/90712f4f-2faa-4e4f-8eb1-9313a8595570",
          "rel": "bookmark"
        }
      ],
      "name": null
    }
  ]
}
```

</p>
</details>

| 이름 | 속성 | 설명 |
|---|---|---|
| volumes | Array | 블록 스토리지 객체 목록 |
| volumes.id | UUID | 블록 스토리지 ID |
| volumes.links | Object | 블록 스토리지 리소스 링크 참조 객체 |
| volumes.name | String | 블록 스토리지 이름 |
| volumes_links  | Object | 페이지 매김(페이지네이션)을 위한 정보 객체 (다음 목록을 가리키는 경로)<br>`limit`, `offset`을 추가한 경우 반환 |


## 블록 스토리지 상세 목록 보기

현재 테넌트에 속한 블록 스토리지 목록을 반환합니다.

### 요청

```
GET /v2/{tenantId}/volumes/detail
X-Auth-Token: {tokenId}
```
### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명                                                                                               |
|---|---|---|---|--------------------------------------------------------------------------------------------------|
| tenantId | URL | String | Y | 테넌트 ID                                                                                           |
| tokenId | Header | String | Y | 토큰 ID                                                                                            |
| sort | Query | String | N | 정렬 기준이 될 블록 스토리지 필드 이름<br>`< key >[: < direction > ]` 형태로 기술<br>예) `name:asc`, `created_at:desc` |
| limit | Query | Integer | N | 반환할 블록 스토리지 개수<br>기본값은 1000으로 설정                                                                 |
| offset | Query | Integer | N | 반환할 목록의 시작점<br/>전체 목록 중 오프셋(offset) 번째 블록 스토리지부터 반환                                              |
| marker | Query | UUID | N | 반환할 블록 스토리지의 직전 블록 스토리지 ID<br/>정렬 순서에 따라 `marker`로 지정된 블록 스토리지 이후부터 `limit` 만큼 반환                |

### 요청 본문

이 API는 요청 본문을 요구하지 않습니다.

### 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "volumes": [
    {
      "attachments": [],
      "links": [
        {
          "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/v2/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/17975e9d-1533-40db-bd02-2072cd2ccb7f",
          "rel": "self"
        },
        {
          "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/17975e9d-1533-40db-bd02-2072cd2ccb7f",
          "rel": "bookmark"
        }
      ],
      "availability_zone": "kr-pub-a",
      "encrypted": false,
      "os-volume-replication:extended_status": null,
      "volume_type": "General HDD",
      "snapshot_id": null,
      "id": "17975e9d-1533-40db-bd02-2072cd2ccb7f",
      "size": 50,
      "user_id": "5e6524d826084188ae549815b3e33380",
      "os-vol-tenant-attr:tenant_id": "6cdebe3eb0094910bc41f1d42ebe4cb7",
      "metadata": {},
      "status": "available",
      "description": null,
      "multiattach": false,
      "source_volid": null,
      "consistencygroup_id": null,
      "name": "volume-f4f47065-300e-480e-8c9c-fb7ec985bffb",
      "bootable": "false",
      "created_at": "2018-12-18T05:43:12.000000",
      "os-volume-replication:driver_data": null,
      "replication_status": "disabled"
    }
  ]
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|
| volumes | Array | 블록 스토리지 상세 정보 객체 목록 |
| volumes.attachments | Object | 블록 스토리지 연결 정보 객체 |
| volumes.attachments.server_id | UUID | 블록 스토리지가 연결된 인스턴스 ID |
| volumes.attachments.attachment_id | UUID | 블록 스토리지 연결 ID |
| volumes.attachments.volume_id |  UUID | 블록 스토리지 ID |
| volumes.attachments.device | String | 인스턴스 내 장치 이름 |
| volumes.attachments.id | String | 블록 스토리지 ID |
| volumes.links | Object | 블록 스토리지 리소스 링크 참조 객체 |
| volumes.availability_zone | String | 블록 스토리지 가용성 영역 |
| volumes.encrypted | Boolean | 블록 스토리지 암호화 여부 |
| volumes.os-volume-replication:extended_status | String | 블록 스토리지 확장 상태 |
| volumes.volume_type | String | 블록 스토리지 타입 이름 |
| volumes.snapshot_id | UUID | 블록 스토리지 생성 시 지정한 스냅숏 ID |
| volumes.id | UUID | 블록 스토리지 ID |
| volumes.size | Integer | 블록 스토리지 크기(GB) |
| volumes.user_id | String | 블록 스토리지 소유주 ID |
| volumes.os-vol-tenant-attr:tenant_id | String | 테넌트 ID |
| volumes.metadata | Object | 블록 스토리지 메타데이터 객체 |
| volumes.status | Enum | 블록 스토리지 상태 |
| volumes.description | String | 블록 스토리지 설명 |
| volumes.multiattach | Boolean | 다중 연결 가능 여부<br>`true`면 여러 인스턴스에 동시에 연결할 수 있음 |
| volumes.source_volid | UUID | 블록 스토리지 생성 시 지정한 블록 스토리지 ID |
| volumes.consistencygroup_id | UUID | 블록 스토리지  그룹 ID |
| volumes.name |  String | 블록 스토리지 이름 |
| volumes.bootable | String | 블록 스토리지 부팅 가능 여부 |
| volumes.created_at | Datetime | 블록 스토리지 생성 시각<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| volumes.os-volume-replication:driver_data | String | 블록 스토리지 복제 데이터 |
| volumes.replication_status | String | 블록 스토리지 복제 상태 |
| volumes.volumes_links  | Object | 페이지 매김(페이지네이션)을 위한 정보 객체(다음 목록을 가리키는 경로)<br>`limit`, `offset`을 추가한 경우 반환 |
| volumes.nhn_encryption            | Object | 블록 스토리지 암호화 정보 |
| volumes.nhn_encryption.skm_key_version | Integer | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 버전 |
| volumes.nhn_encryption.skm_key_id | String | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 ID |


## 블록 스토리지 보기

지정한 블록 스토리지의 상세 정보를 반환합니다.

### 요청

```
GET /v2/{tenantId}/volumes/{volumeId}
X-Auth-Token: {tokenId}
```

### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| volumeId | URL | UUID | Y | 블록 스토리지 ID |
| tokenId | Header | String | Y | 토큰 ID |


### 요청 본문 

이 API는 요청 본문을 요구하지 않습니다.

### 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "volume": {
    "attachments": [],
    "links": [
      {
        "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/v2/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/17975e9d-1533-40db-bd02-2072cd2ccb7f",
        "rel": "self"
      },
      {
        "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/6cdebe3eb0094910bc41f1d42ebe4cb7/volumes/17975e9d-1533-40db-bd02-2072cd2ccb7f",
        "rel": "bookmark"
      }
    ],
    "availability_zone": "kr-pub-a",
    "encrypted": false,
    "os-volume-replication:extended_status": null,
    "volume_type": "General HDD",
    "snapshot_id": null,
    "id": "17975e9d-1533-40db-bd02-2072cd2ccb7f",
    "size": 50,
    "user_id": "5e6524d826084188ae549815b3e33380",
    "os-vol-tenant-attr:tenant_id": "6cdebe3eb0094910bc41f1d42ebe4cb7",
    "metadata": {},
    "status": "available",
    "description": null,
    "multiattach": false,
    "source_volid": null,
    "consistencygroup_id": null,
    "name": "volume-f4f47065-300e-480e-8c9c-fb7ec985bffb",
    "bootable": "false",
    "created_at": "2018-12-18T05:43:12.000000",
    "os-volume-replication:driver_data": null,
    "replication_status": "disabled"
  }
}
```

</p>
</details>

| 이름 | 타입 | 설명 |
|---|---|---|
| volumes | Array | 블록 스토리지 상세 정보 객체 목록 |
| volumes.attachments | Object | 블록 스토리지 연결 정보 객체 |
| volumes.attachments.server_id | UUID | 블록 스토리지가 연결된 인스턴스 ID |
| volumes.attachments.attachment_id | UUID | 블록 스토리지 연결 ID |
| volumes.attachments.volume_id |  UUID | 블록 스토리지 ID |
| volumes.attachments.device | String | 인스턴스 내 장치 이름 |
| volumes.attachments.id | String | 블록 스토리지 ID |
| volumes.links | Object | 블록 스토리지 리소스 링크 참조 객체 |
| volumes.availability_zone | String | 블록 스토리지 가용성 영역 |
| volumes.encrypted | Boolean | 블록 스토리지 암호화 여부 |
| volumes.os-volume-replication:extended_status | String | 블록 스토리지 확장 상태 |
| volumes.volume_type | String | 블록 스토리지 타입 이름 |
| volumes.snapshot_id | UUID | 블록 스토리지 생성 시 지정한 스냅숏 ID |
| volumes.id | UUID | 블록 스토리지 ID |
| volumes.size | Integer | 블록 스토리지 크기(GB) |
| volumes.user_id | String | 블록 스토리지 소유주 ID |
| volumes.os-vol-tenant-attr:tenant_id | String | 테넌트 ID |
| volumes.metadata | Object | 블록 스토리지 메타데이터 객체 |
| volumes.status | Enum | 블록 스토리지 상태 |
| volumes.description | String | 블록 스토리지 설명 |
| volumes.multiattach | Boolean | 다중 연결 가능 여부<br>`true`면 여러 인스턴스에 동시에 연결할 수 있음 |
| volumes.source_volid | UUID | 블록 스토리지 생성 시 지정한 블록 스토리지 ID |
| volumes.consistencygroup_id | UUID | 블록 스토리지  그룹 ID |
| volumes.name |  String | 블록 스토리지 이름 |
| volumes.bootable | String | 블록 스토리지 부팅 가능 여부 |
| volumes.created_at | Datetime | 블록 스토리지 생성 시각<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| volumes.os-volume-replication:driver_data | String | 블록 스토리지 복제 데이터 |
| volumes.replication_status | String | 블록 스토리지 복제 상태 |
| volumes.volumes_links  | Object | 페이지 매김(페이지네이션)을 위한 정보 객체(다음 목록을 가리키는 경로)<br>`limit`, `offset`을 추가한 경우 반환 |
| volumes.nhn_encryption            | Object | 블록 스토리지 암호화 정보 |
| volumes.nhn_encryption.skm_key_version | Integer | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 버전 |
| volumes.nhn_encryption.skm_key_id | String | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 ID |

## 블록 스토리지 생성하기

스냅숏으로부터 새로운 블록 스토리지를 생성하거나 빈 블록 스토리지를 생성합니다.

!!! tip 블록 스토리지는 생성 직후 즉시 사용할 수 없습니다. 블록 스토리지 상태를 조회해서 `available` 상태인 것을 확인한 후 사용합니다.

### 요청

```
POST /v2/{tenantId}/volumes
X-Auth-Token: {tokenId}
```

### 요청 파라미터

| 이름 | 구분 | 타입 | 필수 | 설명                        |
|---|---|---|---|---------------------------|
| tenantId | URL | String | Y | 테넌트 ID                    |
| tokenId | Header | String | Y | 토큰 ID                     |

### 요청 본문

<details>
   <summary><strong>JSON</strong></summary>
<p>

```json
{
    "volume": {
        "size": 10,
        "availability_zone": null,
        "source_volid": null,
        "description": null,
        "snapshot_id": null,
        "name": null,
        "volume_type": null,
        "metadata": {}
    }
}
```

</p>
</details>

| 이름 | 구분 | 타입 | 필수 | 설명                        |
|---|---|---|---|---------------------------|
| volume | Body | Object | Y | 블록 스토리지 생성 요청 객체               |
| volume.size | Body | Integer | Y | 블록 스토리지 크기(GB)                 |
| volume.description | Body | String | N | 블록 스토리지 설명                     |
| volume.availability_zone | Body | String | N | 블록 스토리지 가용성 영역 이름              |
| volume.name | Body | String | N | 블록 스토리지 이름                     |
| volume.volume_type | Body | String | N | 블록 스토리지 타입 이름                  |
| volume.snapshot_id | Body | UUID | N | 원본 스냅숏 ID, 생략하면 빈 블록 스토리지가 생성됨 |
| volume.metadata | Body | Object | N | 블록 스토리지 메타데이터 객체               |
| volume.nhn_encryption            | Body | Object | N | 블록 스토리지 암호화 정보 |
| volume.nhn_encryption.skm_appkey | Body | String | N | Secure Key Manager 상품의 앱키 |
| volume.nhn_encryption.skm_key_id | Body | String | N | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 ID |

### 응답

<details><summary>응답 예시</summary>
<p>

```json
{
  "volume": {
    "status": "creating",
    "user_id": "94acd5b4d2bf47dda734e34a113f96ff",
    "attachments": [],
    "links": [{
      "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/v2/c0e5e63026e449e6b7e94c779021d150/volumes/87882cf4-ca05-4ef2-b598-b93b2caf041e",
      "rel": "self"
    }, {
      "href": "https://kr1-api-block-storage-infrastructure.nhncloudservice.com/c0e5e63026e449e6b7e94c779021d150/volumes/87882cf4-ca05-4ef2-b598-b93b2caf041e",
      "rel": "bookmark"
    }],
    "availability_zone": "kr-pub-a",
    "bootable": "false",
    "encrypted": false,
    "created_at": "2020-03-03T10:54:33.163206",
    "description": null,
    "volume_type": "General HDD",
    "name": "DATA",
    "replication_status": "disabled",
    "consistencygroup_id": null,
    "source_volid": null,
    "snapshot_id": null,
    "multiattach": false,
    "metadata": {},
    "id": "87882cf4-ca05-4ef2-b598-b93b2caf041e",
    "size": 10
  }
}
```

</p>
</details>


| 이름 | 타입 | 설명 |
|---|---|---|
| volume | Object | 블록 스토리지 상세 정보 객체 |
| volume.attachments | Object | 블록 스토리지 연결 정보 객체 |
| volume.links | Object | 블록 스토리지 리소스 링크 참조 객체 |
| volume.availability_zone | String | 블록 스토리지 가용성 영역 |
| volume.encrypted | Boolean | 블록 스토리지 암호화 여부 |
| volume.os-volume-replication:extended_status | Body | String | 블록 스토리지 확장 상태 |
| volume.volume_type | String | 블록 스토리지 타입 이름 |
| volume.snapshot_id | UUID | 블록 스토리지 생성 시 지정한 스냅숏 ID |
| volumes.id | UUID | 블록 스토리지 ID |
| volume.size | Integer | 블록 스토리지 크기(GB) |
| volume.user_id | String | 블록 스토리지 소유주 ID |
| volume.os-vol-tenant-attr:tenant_id | String | 테넌트 ID |
| volume.metadata | Object | 블록 스토리지 메타데이터 객체 |
| volume.status | Enum | 블록 스토리지 상태 |
| volume.description | String | 블록 스토리지 설명 |
| volume.multiattach | Boolean | 여러 인스턴스에 연결 가능 여부 |
| volume.name | String | 블록 스토리지 이름 |
| volume.bootable | String | 블록 스토리지 부팅 가능 여부 |
| volume.created_at | Datetime | 블록 스토리지 생성 시각<br>`YYYY-MM-DDThh:mm:ss.SSSSSS`의 형태 |
| volume.os-volume-replication:driver_data | String | 블록 스토리지 복제 데이터 |
| volume.replication_status | String | 블록 스토리지 복제 상태 |
| volume.nhn_encryption            | Object | 블록 스토리지 암호화 정보 |
| volume.nhn_encryption.skm_key_version | Integer | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 버전 |
| volume.nhn_encryption.skm_key_id | String | 암호화 블록 스토리지 생성에 사용할 Secure Key Manager의 대칭 키 ID |

## 블록 스토리지 삭제하기

지정한 블록 스토리지를 삭제합니다. 연결되어 있거나 스냅숏이 생성된 블록 스토리지는 삭제할 수 없습니다.

### 요청

```
DELETE /v2/{tenantId}/volumes/{volumeId}
X-Auth-Token: {tokenId}
```

### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | Y | 테넌트 ID |
| volumeId | URL | String | Y | 블록 스토리지 ID |
| tokenId | Header | String | Y | 토큰 ID |

### 요청 본문 

이 API는 요청 본문을 요구하지 않습니다.

### 응답

이 API는 응답 본문을 반환하지 않습니다.

## 블록 스토리지로 이미지 생성하기

블록 스토리지로부터 이미지를 생성합니다. 

!!! tip 이미지 생성 이후 기본적인 초기화 작업을 위해 최소 100KB의 여유 공간이 필요합니다. 남은 공간이 이보다 작을 경우 초기화 작업이 실패할 수 있습니다.

### 요청

```
POST /v2/{tenantId}/volumes/{volumeId}/action
X-Auth-Token: {tokenId}
```

### 요청 파라미터 

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| tenantId | URL | String | O | 테넌트 ID |
| volumeId | URL | UUID | O | 블록 스토리지 ID |
| tokenId | Header | String | O | 토큰 ID |


### 요청 본문

<details><summary>JSON</summary>
<p>

```json
{
	"os-volume_upload_image":{
        "image_name": "VOLUME IMAGE",
        "force": true,
        "disk_format": "qcow2",
        "container_format": "bare",
        "visibility": "private",
        "protected": false
    }
}
```

</p>
</details>

| 이름 | 구분 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| os-volume_upload_image | Body | Object | Y | 블록 스토리지 이미지 생성 요청 객체 |
| os-volume_upload_image.image_name | Body | String | Y | 이미지 이름 |
| os-volume_upload_image.force | Body | Boolean | N | 인스턴스에 연결된 블록 스토리지일 때 이미지 생성 허용 여부<br>기본값은 false |
| os-volume_upload_image.disk_format | Body | String | N | 이미지 디스크 포맷 |
| os-volume_upload_image.container_format | Body | String | N | 이미지 컨테이너 포맷 |
| os-volume_upload_image.visibility | Body | String | N | 이미지 가시성<br>`private`, `shared` 중 하나 |
| os-volume_upload_image.protected | Body | Boolean | N | 이미지 보호 여부</br>protected=true인 경우 수정 및 삭제가 불가 |

### 응답

<details><summary>응답 예시</summary>
<p>

```json
{
    "os-volume_upload_image": {
        "status": "uploading",
        "image_name": "public api test2",
        "disk_format": "qcow2",
        "container_format": "bare",
        "updated_at": "2020-05-18T04:21:15.000000",
        "image_id": "01956bf6-5609-4b43-88ea-1be866114368",
        "id": "d16d64e8-a5c9-47fe-a559-1119778c739c",
        "size": 20,
        "volume_type": {
            "name": "General HDD",
            "qos_specs_id": "ec4ef37d-9273-4e6f-a495-bd43b0f2d0f2",
            "deleted": false,
            "deleted_at": "null",
            "created_at": "2019-10-10T06:34:33.000000",
            "updated_at": "2019-10-10T06:37:52.000000",
            "extra_specs": [
                {
                    "volume_type_id": "964a6c6b-7190-4e27-9311-cce8d6f860f3",
                    "deleted": false,
                    "created_at": "2019-10-10T06:39:35.000000",
                    "updated_at": "null",
                    "deleted_at": "null",
                    "value": "hdd_general",
                    "key": "volume_backend_name",
                    "id": 1
                }
            ],
            "is_public": true,
            "id": "964a6c6b-7190-4e27-9311-cce8d6f860f3",
            "description": "null"
        }
    }
}
```

</p>
</details>


| 이름 | 타입 | 설명 |
|---|---|---|
| os-volume_upload_image | Object | 블록 스토리지 이미지 생성 응답 객체 |
| os-volume_upload_image.status | String | 블록 스토리지 상태 |
| os-volume_upload_image.image_name | String | 이미지 이름 |
| os-volume_upload_image.disk_format | String | 이미지 디스크 포맷 |
| os-volume_upload_image.container_format | String | 이미지 컨테이너 포맷 |
| os-volume_upload_image.updated_at | Datetime | 이미지 수정 시각 |
| os-volume_upload_image.image_id | UUID | 이미지 ID |
| os-volume_upload_image.display_description | String | 블록 스토리지 설명 |
| os-volume_upload_image.id | UUID | 블록 스토리지 ID |
| os-volume_upload_image.size |Integer | 블록 스토리지 크기(GB) |
| os-volume_upload_image.volume_type | Object | 블록 스토리지 타입 정보 객체 |


