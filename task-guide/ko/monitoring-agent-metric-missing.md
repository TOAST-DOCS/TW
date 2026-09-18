# Cloud Monitoring에서 인스턴스 지표가 표시되지 않습니다

## 증상

Cloud Monitoring 콘솔에서 특정 인스턴스의 지표가 표시되지 않습니다. 대시보드 차트에 해당 인스턴스의 데이터가 나타나지 않거나, 차트 하단의 인스턴스 목록에 해당 인스턴스가 나타나지 않습니다. 별도의 오류 메시지 없이 차트가 비어 있는 상태로 표시됩니다.

Cloud Monitoring 에이전트는 인스턴스 생성 시 자동으로 설치되지만, OS 설정에 따라 에이전트가 정상 동작하지 않을 수 있습니다. 주로 OS 업데이트 후 또는 인스턴스 재시작 후에 나타납니다.

## 빠른 확인

다음을 먼저 확인하세요. 에이전트 프로세스 상태와 시스템 시간을 확인하면 원인을 빠르게 좁힐 수 있습니다.

1. 에이전트 프로세스가 실행 중인지 확인합니다.

   **Linux**:
   ```sh
   systemctl status nhncloud-telegraf
   ```

   `active (running)` 상태가 아니면 원인 1을 확인합니다.

   **Windows**(PowerShell을 관리자 권한으로 실행):
   ```powershell
   Get-Service -Name "nhncloud-telegraf"
   ```

   `Status`가 `Running`이 아니면 원인 1을 확인합니다.

2. 인스턴스의 시스템 시간이 현재 시간과 일치하는지 확인합니다.

   ```sh
   date
   ```

   현재 시간과 수 분 이상 차이가 나면 원인 2를 확인합니다.

## 원인과 해결 방법

다음 흐름으로 원인을 좁힌 뒤, 원인별로 이어지는 해결 방법을 적용하세요.

[원인 확인 흐름도 추가]

### 원인 1: 에이전트 프로세스가 실행되지 않음

에이전트가 수집 서버와의 통신에 실패하거나 서비스 구성이 손상되면 에이전트 서비스가 시작되지 않습니다. 인스턴스 재시작, OS 업데이트, 하이퍼바이저 점검 후 재기동 등의 상황에서 발생할 수 있습니다.

**Linux**에서 `systemctl status` 명령으로 확인하면 `activating (auto-restart)`, `failed`, 또는 `inactive` 상태로 나타납니다. 다음과 같은 메시지가 표시될 수 있습니다.

신규 에이전트(`nhncloud-telegraf`):
```
nhncloud-telegraf.service: Main process exited, code=exited, status=1/FAILURE
nhncloud-telegraf.service: Failed with result 'exit-code'.
Failed to start NHN Cloud Telegraf.
```

기존 에이전트(`toast-sysmon`):
```
Failed to start TOAST System Monitoring Agent Service.
```

```
toast-sysmon.service: Failed to parse PID from file /run/toast-sysmon.pid: Invalid argument
```

**Windows**에서 `Get-Service` 명령으로 확인하면 `Status`가 `Stopped`로 나타납니다.

**해결 방법**

1. 에이전트를 재시작합니다.

   **Linux**:
   ```sh
   sudo systemctl restart nhncloud-telegraf
   ```

   **Windows**(PowerShell을 관리자 권한으로 실행):
   ```powershell
   Restart-Service -Name "nhncloud-telegraf"
   ```

   재시작 후 서비스가 정상 실행 상태(Linux: `active (running)`, Windows: `Running`)가 되면 몇 분 뒤 콘솔에서 지표를 확인합니다.

2. 재시작으로 해결되지 않으면 에이전트를 재설치합니다. 설치 스크립트는 기존 버전을 자동으로 감지하고 삭제한 뒤 최신 버전을 설치합니다.

   **Linux**:
   ```sh
   rm -f ./install-nhncloud-telegraf.sh
   curl -s -o install-nhncloud-telegraf.sh 'http://169.254.169.231/monitoring/cloud-agent/linux-amd64/install-nhncloud-telegraf.sh'
   chmod 755 ./install-nhncloud-telegraf.sh
   sudo ./install-nhncloud-telegraf.sh
   ```

   **Windows**(PowerShell을 관리자 권한으로 실행):
   ```powershell
   Remove-Item install-nhncloud-telegraf.ps1 -ErrorAction SilentlyContinue
   Invoke-WebRequest -Uri 'http://169.254.169.231/monitoring/cloud-agent/windows-amd64/install-nhncloud-telegraf.ps1' -OutFile 'install-nhncloud-telegraf.ps1'
   powershell -ExecutionPolicy Bypass -File install-nhncloud-telegraf.ps1
   ```

   설치 후 에이전트 서비스가 정상 실행 상태(Linux: `active (running)`, Windows: `Running`)인지 다시 확인합니다.

3. 재설치 후에도 서비스가 시작되지 않으면 [NHN Cloud 고객지원](https://www.nhncloud.com/kr/support/inquiry)에 문의하세요.

### 원인 2: 인스턴스의 시스템 시간이 현재 시간과 맞지 않음

Cloud Monitoring 수집 서버는 에이전트가 보내는 지표 데이터의 타임스탬프를 기준으로 유효성을 판단합니다. 인스턴스의 시스템 시간이 실제 시간과 크게 차이 나면, 수집 서버가 해당 데이터를 유효하지 않은 것으로 처리해 지표가 누락될 수 있습니다. 에이전트 프로세스는 정상 실행 중이고 네트워크 연결에도 문제가 없지만, 콘솔에는 지표가 표시되지 않을 수 있습니다.

NTP(Network Time Protocol)가 설정되지 않은 인스턴스에서 장시간 운영하거나, OS 업데이트 후 시간 동기화 설정이 초기화된 경우에 발생할 수 있습니다.

**해결 방법**

1. 인스턴스의 현재 시스템 시간을 확인합니다.

   **Linux**:
   ```sh
   date
   timedatectl status
   ```

   **Windows**(PowerShell):
   ```powershell
   Get-Date
   w32tm /query /status
   ```

2. 시스템 시간이 현재 시간과 차이가 나면 NTP 동기화를 설정합니다. 인스턴스에 설치된 NTP 서비스에 따라 다음 중 해당하는 방법을 사용합니다.

   **systemd-timesyncd**(Ubuntu 기본):
   ```sh
   sudo systemctl enable systemd-timesyncd
   sudo systemctl start systemd-timesyncd
   timedatectl show-timesync --all
   ```

   **chrony**(CentOS, Rocky Linux 등):
   ```sh
   sudo systemctl enable chronyd
   sudo systemctl start chronyd
   chronyc tracking
   ```

   **ntpd**:
   ```sh
   sudo systemctl enable ntpd
   sudo systemctl start ntpd
   ntpq -p
   ```

   어떤 NTP 서비스가 설치되어 있는지 확인하려면 다음 명령을 실행합니다.

   ```sh
   systemctl list-units --type=service | grep -E 'chrony|ntp|timesyncd'
   ```

   **Windows**(PowerShell을 관리자 권한으로 실행):
   ```powershell
   # Windows Time 서비스 시작
   Set-Service -Name "w32time" -StartupType Automatic
   Start-Service -Name "w32time"
   w32tm /resync
   w32tm /query /status
   ```

3. 시간 동기화 후 에이전트를 재시작합니다.

   **Linux**:
   ```sh
   sudo systemctl restart nhncloud-telegraf
   ```

   **Windows**(PowerShell을 관리자 권한으로 실행):
   ```powershell
   Restart-Service -Name "nhncloud-telegraf"
   ```

4. 몇 분 뒤 Cloud Monitoring 콘솔에서 지표가 표시되는지 확인합니다.

### 원인 3: 구버전 에이전트가 설치되어 있음

Cloud Monitoring 에이전트는 기존 `toast-sysmon`(Linux) / `toastmon`(Windows)에서 `nhncloud-telegraf`로 변경되었습니다. 신규 에이전트와 기존 에이전트는 동시에 설치되어도 문제없이 동작하지만, 기존 에이전트만 설치된 상태에서 서비스 환경이 변경되면 수집이 중단될 수 있습니다. 구버전만 실행 중이라면 신규 에이전트 설치가 필요합니다.

**해결 방법**

1. 현재 설치된 에이전트 버전을 확인합니다.

   **Linux**:
   ```sh
   systemctl status toast-sysmon
   systemctl status nhncloud-telegraf
   ```

   **Windows**(PowerShell):
   ```powershell
   Get-Service -Name "toastmon" -ErrorAction SilentlyContinue
   Get-Service -Name "nhncloud-telegraf" -ErrorAction SilentlyContinue
   ```

2. 구버전(`toast-sysmon` 또는 `toastmon`)만 실행 중이면 [원인 1의 해결 방법](#원인-1-에이전트-프로세스가-실행되지-않음)에 있는 신규 에이전트 설치 명령어를 실행합니다. 신규 에이전트와 기존 에이전트는 동시에 설치되어도 문제없이 동작합니다.
3. 설치 후 `nhncloud-telegraf` 서비스가 정상 실행 상태(Linux: `active (running)`, Windows: `Running`)인지 확인하고, 몇 분 뒤 콘솔에서 지표가 표시되는지 확인합니다.
4. 신규 에이전트가 정상 동작하면 기존 에이전트를 삭제합니다.

   **Linux**:
   ```sh
   curl -s -o uninstall-sysmon-agent.sh 'http://169.254.169.231/monitoring/cloud-agent/linux-amd64/uninstall-sysmon-agent.sh'
   chmod 755 ./uninstall-sysmon-agent.sh
   sudo ./uninstall-sysmon-agent.sh
   ```

   **Windows**:
   ```powershell
   & "C:\Program Files (x86)\NHN\TOAST\uninst.exe"
   ```

> [!NOTE]
> 신규 에이전트 설치 및 기존 에이전트 삭제에 대한 자세한 내용은 [Instance 신규 지표 연동 가이드](https://docs.nhncloud.com/ko/Monitoring/Cloud%20Monitoring/ko/new-instance-metric/#new-agent-installation-guide)를 참고하세요.

### 원인 4: 에이전트 캐시 파일이 손상됨(Windows)

Windows 인스턴스에서 에이전트 설치 시 실행 파일이 `C:\ProgramData\nhncloud-telegraf\cache\` 폴더에 캐시됩니다. 설치 과정에서 다운로드가 불완전하게 이루어지면 캐시된 실행 파일이 손상되어 에이전트 서비스가 시작되지 않을 수 있습니다. 이 파일은 매번 새로 다운로드되지 않으므로, 한 번 손상되면 재설치해도 같은 문제가 반복됩니다.

> [!NOTE]
> `C:\ProgramData`는 숨김 폴더입니다. 파일 탐색기에서 확인하려면 **보기 > 숨김 항목**을 활성화해야 합니다.

**해결 방법**

1. 캐시된 에이전트 실행 파일을 삭제합니다(PowerShell을 관리자 권한으로 실행).

   ```powershell
   Remove-Item "C:\ProgramData\nhncloud-telegraf\cache\*" -Force
   ```

2. 에이전트를 재설치합니다.

   ```powershell
   Remove-Item install-nhncloud-telegraf.ps1 -ErrorAction SilentlyContinue
   Invoke-WebRequest -Uri 'http://169.254.169.231/monitoring/cloud-agent/windows-amd64/install-nhncloud-telegraf.ps1' -OutFile 'install-nhncloud-telegraf.ps1'
   powershell -ExecutionPolicy Bypass -File install-nhncloud-telegraf.ps1
   ```

3. 설치 후 에이전트 서비스가 `Running` 상태인지 확인합니다.

   ```powershell
   Get-Service -Name "nhncloud-telegraf"
   ```

## 문의하기

위 방법으로 해결되지 않으면 [NHN Cloud 고객지원](https://www.nhncloud.com/kr/support/inquiry)에 문의하세요. 에이전트 프로세스가 정상인데도 지표가 수집되지 않는 경우, 수집 서버 측 설정이나 내부 이슈일 수 있으며 NHN Cloud의 확인이 필요합니다. 문의 시 다음 정보를 함께 전달하면 빠른 진단에 도움이 됩니다.

- 지표가 수집되지 않는 인스턴스의 ID
- 인스턴스의 OS 종류와 버전
- 에이전트 서비스 상태 확인 결과(`systemctl status nhncloud-telegraf` 출력 전문)
- 에이전트 로그 파일(`/var/log/nhncloud-telegraf/telegraf.log`)
- 증상이 발생한 시각(KST 기준)
- 인스턴스의 시스템 시간(`date` 명령 출력)

## 문제 예방하기

- **에이전트 설치 후 즉시 지표 표시를 확인**: 에이전트를 설치하면 몇 분 뒤 Cloud Monitoring 콘솔에서 지표가 표시되는지 확인합니다. 초기에 문제를 발견하면 원인을 빠르게 좁힐 수 있습니다.
- **NTP 동기화를 기본 설정으로 유지**: 인스턴스 생성 후 NTP 서비스(`systemd-timesyncd`, `chronyd`, `ntpd` 중 하나)가 활성화되어 있는지 확인합니다. OS 업데이트 후에도 동기화 설정이 유지되는지 점검합니다.

