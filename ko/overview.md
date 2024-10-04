# Block Storage 개요
**Storage > Block Storage > 개요**

블록 스토리지는 데이터를 블록 단위로 분리해 저장합니다. 데이터를 저장할 때 특정 단일 경로에 의존하지 않으므로 신속한 검색이 가능하며, 각각의 블록은 독립적으로 존재하고 파티션으로 분할할 수 있어 서로 다른 운영체제에 접근할 수도 있습니다.

NHN Cloud의 Block Storage는 인스턴스에 할당하여 사용할 수 있는 블록 수준 스토리지입니다. 인스턴스 생성 시 기본으로 연결해 사용하는 루트 블록 스토리지 외에 추가 스토리지가 필요할 경우 Block Storage 서비스를 이용해 저장 공간을 증설할 수 있습니다. 인스턴스를 삭제해도 블록 스토리지의 데이터는 삭제되지 않으며, 언제든 현재 연결되어 있는 인스턴스와의 연결 을 해제하고 같은 가용성 영역 안에 있는 다른 인스턴스에 연결해 사용할 수 있습니다. 또한 인스턴스를 삭제하기 전 인스턴스의 루트 블록 스토리지에 있는 데이터를 영구 보관하기 위해 블록 스토리지를 장착하여 데이터를 복사할 수 있습니다.

![bs_02_대지 1](https://github.com/user-attachments/assets/e1a56367-df12-4e2d-a4a4-eadab9674033)

스냅숏 기능을 이용하면 특정 시점의 블록 스토리지 상태를 저장하고 복구할 수 있습니다. 스냅숏을 복구할 때는 원래 블록 스토리지가 위치해 있던 가용성 영역뿐만 아니라 다른 가용성 영역에서도 가능하며, 다른 가용성 영역에 있는 인스턴스에 복구된 블록 스토리지를 연결해 사용할 수 있습니다.

<!--작성자는 편한 방법으로 초안을 그려 테크니컬 라이터에게 전달합니다. 테크니컬 라이터는 이미지 스타일 가이드에 따라 최종 이미지를 가공·제작하여 요청자에게 전달합니다. 요청자는 이미지가 의도에 맞게 제작되었는지 검토한 뒤 가이드 문서에 첨부합니다.-->

<!--서비스에 대한 간단한 소개 후 이 가이드에 대한 소개를 기재하기 전 한 줄 공백을 추가합니다.-->

이 문서에서는 NHN Cloud Block Storage 서비스의 주요 기능에 대해 살펴보고 Block Storage 서비스에서 사용하는 용어와 요금 체계를 안내합니다.

### Block Storage 시작하기

* [블록 스토리지 생성](https://docs.nhncloud.com/ko/Storage/Block%20Storage/ko/console-guide/#_1)<br>
* [블록 스토리지 크기 변경](https://docs.nhncloud.com/ko/Storage/Block%20Storage/ko/console-guide/#_4)<br>
* [블록 스토리지 연결 관리](https://docs.nhncloud.com/ko/Storage/Block%20Storage/ko/console-guide/#_7)

### 용어 정리

<!-- 해당 서비스에서 다룰 주요 용어나 기술적인 용어를 정리합니다. 용어는 표 형태로 제공하며, 가급적이면 가나다순, ABC순으로 기재합니다. -->

| 용어 | 설명 |
| --- | --- |
| 블록 스토리지 | 데이터를 블록 단위로 나눠서 저장하는 블록 수준 데이터 스토리지로, 인스턴스 기본 디스크 외에 추가로 연결하여 사용할 수 있는 저장 공간 |
| 스냅숏 | 특정 시점의 스토리지 데이터를 저장하고, 장애나 데이터 손상 시 해당 시점의 데이터를 원하는 서버로 복구할 수 있는 기능 |

## Block Storage 주요 기능

* 인스턴스를 삭제해도 데이터를 보관할 수 있습니다.
* 추가적인 디스크 공간을 확보할 수 있습니다.
* 스냅숏을 이용해 특정 시점의 블록 스토리지 상태를 저장 및 복구할 수 있습니다.
* 인스턴스에 연결된 블록 스토리지 연결을 해제한 뒤 다른 인스턴스에 연결할 수 있습니다.
* 스냅숏을 생성해 블록 스토리지를 복제할 수 있습니다.

## Block Storage 요금 안내

<!-- 아래 요금 안내는 예시이며, 서비스 특성에 따라 자유롭게 변경 및 활용이 가능합니다. -->

블록 스토리지는 생성한 시점부터 요금이 부과되며, 생성 시 설정한 블록 스토리지의 크기에 따라 요금이 부과됩니다. 스냅숏의 경우 원본 블록 스토리지의 크기에 따라 요금이 부과됩니다. 자세한 내용은 [Block Storage 서비스 페이지](https://www.nhncloud.com/kr/service/storage/block-storage)를 참고하세요.

## 관련 콘텐츠 더 알아보기

* [Instance](https://docs.nhncloud.com/ko/Compute/Instance/ko/overview/)<br>
* [Instance Template](https://docs.nhncloud.com/ko/Compute/Instance%20Template/ko/overview/)<br>
* [Object Storage](https://docs.nhncloud.com/ko/Storage/Object%20Storage/ko/Overview/)<br>
* [NAS](https://docs.nhncloud.com/ko/Storage/NAS/ko/overview/)
