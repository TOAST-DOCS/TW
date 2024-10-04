# Block Storage 크기 변경
**Storage > Block Storage > 콘솔 사용 가이드 > Block Storage 크기 변경**

블록 스토리지의 크기를 변경할 수 있습니다. 블록 스토리지의 크기는 줄일 수 없으며, 늘릴 수만 있습니다. 인스턴스에 연결된 블록 스토리지의 경우 다음을 참고하여 파티션과 파일 시스템을 확장해야 합니다.

## Linux 인스턴스 크기 변경하기

### 파티션 확장

1. 다음 명령어를 입력해 블록 스토리지의 파티션을 확인합니다.

        ```
        # sudo lsblk
        ```

2. 파티션을 확장합니다.
    예를 들어 `/dev/vda` 디바이스의 1번 파티션을 확장하려는 경우 명령어는 아래와 같습니다.

        ```
        # sudo growpart /dev/vda 1
        ```

3. 다음 명령어를 입력해 확장된 파티션을 확인합니다.

        ```
        # sudo lsblk
        ```

### 파일 시스템 확장

1. 다음 명령어를 입력해 확장할 파일 시스템의 유형을 확인합니다.

        ```
        # df -hT
        ```

2. 파일 시스템의 유형에 따라 다음 명령어를 입력해 확장합니다.
    **[XFS 파일 시스템]** 예를 들어 `/`에 마운트된 파일 시스템을 확장하려는 경우 명령어는 아래와 같습니다.

        ```
        # sudo xfs_growfs -d /
        ```

    **[Ext4 파일 시스템]** 예를 들어 `/dev/vda` 디바이스의 파일 시스템을 확장하려는 경우 명령어는 아래와 같습니다.

        ```
        # sudo resize2fs /dev/vda
        ```

3. 다음 명령어를 입력해 확장된 파일 시스템을 확인합니다.

        ```
        # df -hT
        ```

## Windows 인스턴스 크기 변경하기

1. Windows 시작 메뉴 > **Run**에서 **diskmgmt.msc**를 입력한 뒤 **OK**를 클릭해 디스크 관리 유틸리티를 실행합니다. 블록 스토리지에 추가된 크기만큼 **Unallocated** 상태로 표시되어 있는 것을 확인할 수 있습니다.

![windows_volume_extend_01](https://github.com/user-attachments/assets/4b1766a8-a10a-4601-bf13-72c3f032210b)
<br>
2. 확장된 드라이브를 마우스 오른쪽 버튼으로 클릭한 뒤 <strong>Extend Volume...</strong>을 클릭해 볼륨 확장 마법사를 실행합니다.

![windows_volume_extend_02](https://github.com/user-attachments/assets/d1d5edb3-f031-4bb5-88bd-e2f6b848ba2c)
<br>
3. 볼륨 확장 마법사에서 **Next**를 클릭합니다.<br>
4. **Select the amount of space in MB**에 확장할 메가바이트 수를 입력합니다. 입력 가능한 최대 메가바이트 수는 Maximum available space in MB를 참고합니다.<br>
5. 다시 **Next**를 클릭해 볼륨 확장 마법사를 완료합니다.<br>

![windows_volume_extend_03](https://github.com/user-attachments/assets/42ac5a43-3ebf-4ad6-93c9-880c008cdb9a)
<br>
6. **내 컴퓨터**에서 확장된 드라이브를 확인합니다.
