# Block Storage 문제 해결 가이드

**Stoeage > Block Storage > 문제 해결 가이드**

## 의도하지 않은 블록 스토리지로 부팅됩니다.

인스턴스에 추가로 연결한 블록 스토리지가 `/`에 마운트된 상태로 인스턴스가 부팅될 수 있습니다. 이 현상은 주로 인스턴스의 OS 이미지로 생성된 블록 스토리지를 다른 인스턴스에 추가로 연결할 때 발생합니다.

Linux는 부팅 시 `/etc/fstab`을 통해 `/`에 마운트할 블록 스토리지를 결정합니다. NHN Cloud에서 사용하는 OS 이미지의 경우 파일 시스템 UUID를 기준으로 마운트할 블록 스토리지를 결정하는데, 파일 시스템 UUID 값이 같은 블록 스토리지가 연결되면 의도하지 않은 블록 스토리지가 `/`에 마운트될 수 있습니다.

```
# cat /etc/fstab
...
UUID=6cd50e51-cfc6-40b9-9ec5-f32fa2e4ff02 /                       xfs     defaults        0 0
```

`blkid` 명령어를 통해 블록 스토리지의 파일 시스템 UUID를 확인할 수 있습니다.

```
# blkid
/dev/vda1: UUID="6cd50e51-cfc6-40b9-9ec5-f32fa2e4ff02" TYPE="xfs"
/dev/vdb1: UUID="6cd50e51-cfc6-40b9-9ec5-f32fa2e4ff02" TYPE="xfs"
```

위와 같이 추가로 연결된 블록 스토리지의 파일 시스템 UUID가 동일하면, Linux 배포판 동작 방식에 따라 추가로 연결한 블록 스토리지가 `/`에 마운트될 수 있습니다.

다음 절차를 따라 두 블록 스토리지의 파일 시스템 UUID를 다르게 하여 문제를 해결합니다.

1. 인스턴스를 중지한 뒤 문제를 일으키는(즉, `/`로 잘못 마운트되던) 블록 스토리지의 연결을 해제합니다.
2. 인스턴스를 시작합니다.
3. 부팅이 완료되면 문제를 일으키는 블록 스토리지를 다시 연결합니다.
4. 다음 명령어를 통해 문제를 일으키는 블록 스토리지의 파일 시스템 UUID를 교체합니다. 문제를 일으키는 블록 스토리지의 타입에 따라 다음 명령어를 실행합니다. 블록 스토리지의 타입은 `blkid` 명령어를 통해 확인할 수 있습니다.

* 문제를 일으키는 블록 스토리지의 파일 시스템이 ext4일 경우

        ```
        # tune2fs -U random /dev/vdb1
        tune2fs 1.42.9 (28-Dec-2013)
        Setting the UUID on this filesystem could take some time.
        Proceed anyway (or wait 5 seconds to proceed) ? (y,N) y
        ```

* 문제를 일으키는 블록 스토리지의 파일 시스템이 xfs일 경우

        ```
        # xfs_admin -U generate /dev/vdb1
        Clearing log and setting UUID
        writing all SBs
        new UUID = 0037c590-0545-4736-bcdc-d052681eb5f5
        ```

5. 파일 시스템 UUID가 바뀐 것을 확인합니다.

        ```
        # blkid
        /dev/vda1: UUID="6cd50e51-cfc6-40b9-9ec5-f32fa2e4ff02" TYPE="xfs"
        /dev/vdb1: UUID="0037c590-0545-4736-bcdc-d052681eb5f5" TYPE="xfs"
        ```

## 블록 스토리지를 마운트하는 데 실패하여 인스턴스가 동작하지 않습니다.

블록 스토리지를 추가할 때 `/etc/fstab`을 잘못 설정할 경우 부팅 과정에서 볼륨 마운트에 실패하고, 인스턴스가 emergency mode로 진입할 수 있습니다.

이러한 상황을 방지하기 위해 추가 블록 스토리지를 `/etc/fstab`에 등록할 경우 [블록 스토리지 마운트 가이드](https://docs.nhncloud.com/ko/Storage/Block%20Storage/ko/overview/#_4)에 따라 `nofail` 옵션을 사용할 것을 권장합니다. 만약 `/etc/fstab`를 잘못 수정하여 인스턴스가 정상적으로 부팅되지 않는다면 [NHN Cloud 고객 센터](https://www.nhncloud.com/kr/support)로 문의하세요.

***

 <!--문서 최하단에는 문제 해결 가이드의 안내에 따랐음에도 해결되지 않는 문제가 있거나, 문제 해결 가이드에서 제시하고 있는 상황 외의 문제가 있을 경우 도움을 받을 수 있도록 컨택 포인트를 아래와 같이 제시합니다. 템플릿에서 아래 내용을 삭제하지 않습니다. -->


!!! tip "문제가 해결되지 않을 경우"
    문제 해결 가이드의 안내에 따라 진행하였으나 문제가 해결되지 않을 경우 [NHN Cloud 고객 센터](https://www.nhncloud.com/kr/support)로 문의하세요.
    * 온라인 1:1 문의: [https://www.nhncloud.com/kr/support/inquiry?alias=tab5_03](https://www.nhncloud.com/kr/support/inquiry?alias=tab5_03)
    * 대표 전화: 1588-7967 (운영 시간: 월~금 10:00-19:00)
