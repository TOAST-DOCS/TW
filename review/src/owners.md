# 서비스별 담당 매핑 (owners) — 마스터

배포와 무관한 **전체 서비스 마스터**입니다. 담당자가 바뀌면 **이 파일만 수정**하세요.
매월 빌드(`python build_dashboard.py`) 시 그 달 배포된 서비스의 정보가 대시보드에 반영됩니다.

- 범위: 검수대상 166개(`repos_targets.txt`)
- 형식: `| 리포지토리(repo명) | 서비스(실제 서비스명) | 작성자 | 검수 |`
- **서비스 자동 채움**: 각 repo ko 문서 상단 breadcrumb의 2번째 세그먼트(예: `AI Service > Text to Speech > 개요` → Text to Speech). 출처 `service_names_2026-06.tsv`.
- **작성자 자동 채움**: ko/ 최다 커밋 작성자(배포자 '최현욱' 제외). 출처 `ko_authors_2026-06.tsv`.
- 둘 다 검증·수정용 초기값. 검수는 미정이면 `미지정`. 리포지토리명은 TOAST-DOCS repo명과 정확히 일치해야 매핑됩니다.

| 리포지토리 | 서비스 | 작성 | 검수 |
|------------|--------|--------|------|
| AI-Fashion | AI Fashion | AI서비스개발팀/NHN | 박선영 |
| Alimtalk | KakaoTalk Bizmessage | 메시징플랫폼개발팀/CLOUD | 하수진 |
| API-Gateway | API Gateway | 서비스개발팀/CLOUD | 하수진 |
| AppGuard | NHN AppGuard | 앱서비스보안팀/CLOUD | 박선영 |
| autocomplete | Autocomplete | 테크니컬라이팅파트/CLOUD | 박선영 |
| CDN | CDN | 서비스개발팀/CLOUD | 하수진 |
| Certificate-Manager | Certificate Manager | 배포플랫폼개발팀/CLOUD | 하수진 |
| Cloud-Access | Cloud Access | 클라우드보안실/CLOUD | 박선영 |
| Cloud-Functions | Cloud Functions | 배포플랫폼개발팀/CLOUD | 하수진 |
| Cloud-Scheduler | Cloud Scheduler | 데이터플랫폼개발팀/CLOUD | 하수진 |
| Cloud-Search | Cloud Search | 재무서비스개발팀/DOORAY | 박선영 |
| CloudTrail | CloudTrail | 로그플랫폼개발팀/CLOUD | 박선영 |
| Colocation-Gateway | Colocation Gateway | 네트워크인프라개발팀/CLOUD | 박선영 |
| Compute | Instance | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-Auto-Scale | Auto Scale | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-GPU | GPU Instance | AI인프라팀/CLOUD | 하수진 |
| Compute-Image | Image | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-Image-Builder | Image Builder | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-Instance | Instance | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-Instance-Template | Instance Template | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Compute-VirtualDesktop | Virtual Desktop | DaaS사업팀/CLOUD | 하수진 |
| Contact-Center | Contiple | CX인사이트팀/NHN | 하수진 |
| Container-Container-Registry | NHN Container Registry(NCR) | 컨테이너인프라개발팀/CLOUD | 박선영 |
| Container-Container-Registry-v2 | NHN Container Registry(NCR) | 컨테이너인프라개발팀/CLOUD | 박선영 |
| Container-Container-Service | NHN Container Service(NCS) | 컨테이너인프라개발팀/CLOUD | 박선영 |
| Container-Kubernetes | NHN Kubernetes Service(NKS) | 컨테이너인프라개발팀/CLOUD | 박선영 |
| Corporations-Search | Corporation Search | 재무서비스개발팀/DOORAY | 박선영 |
| cubrid-instance-guide | CUBRID Instance | 데이터운영실/CLOUD | 하수진 |
| Data-Flow | DataFlow | 데이터플랫폼개발팀/CLOUD | 하수진 |
| Data-Lake-Storage | Data Lake Storage | 데이터플랫폼개발팀/CLOUD | 하수진 |
| Data-Query | DataQuery | 데이터플랫폼개발팀/CLOUD | 하수진 |
| Database-MariaDB | MariaDB Instance | 데이터운영실/CLOUD | 하수진 |
| Database-MS-SQL | MS-SQL Instance | 데이터운영실/CLOUD | 하수진 |
| Database-MySQL | MySQL Instance | 데이터운영실/CLOUD | 하수진 |
| Database-PostgreSQL | PostgreSQL Instance | 데이터운영실/CLOUD | 하수진 |
| DDoS-Guard | DDoS Guard | 클라우드보안실/CLOUD | 박선영 |
| Deploy | Deploy | 배포플랫폼개발팀/CLOUD | 하수진 |
| DirectConnect | Direct Connect | 기획실/CLOUD | 박선영 |
| E-mail | Email | 메시징플랫폼개발팀/CLOUD | 하수진 |
| EasyCache | EasyCache | 클라우드DB개발팀/CLOUD | 하수진 |
| EasyMaker | AI EasyMaker | ML플랫폼개발팀/CLOUD | 하수진 |
| EasyQueue | EasyQueue | 서비스개발팀/CLOUD | 하수진 |
| Face-Recognition | Face Recognition | AI서비스개발팀/NHN | 박선영 |
| File-Crafter | File-Crafter | 메세징플랫폼개발팀/CLOUD | 하수진 |
| Floating-IP | Floating IP | 네트워크인프라개발팀/CLOUD | 박선영 |
| GameAnvil | GameAnvil | 게임서버엔진팀/NHN | 박선영 |
| Gamebase | Gamebase | 게임플랫폼클라팀/NHN | 박선영 |
| GameStarter | GameStarter | 게임플랫폼서버팀/NHN | 박선영 |
| Image | Image Manager | ML플랫폼개발팀/CLOUD | 하수진 |
| Internet-Gateway | Internet Gateway | 네트워크인프라개발팀/CLOUD | 박선영 |
| kms | Secure Key Manager | 성능보안개발팀/CLOUD | 박선영 |
| Launching | Launching | 클라우드DB개발팀/CLOUD | 박선영 |
| Leaderboard | Leaderboard | 게임플랫폼서버팀/CLOUD | 박선영 |
| Load-Balancer-DSR | Load Balancer(DSR) | 네트워크인프라개발팀/CLOUD | 박선영 |
| Log-Crash-Search | Log & Crash Search | 로그플랫폼개발팀/CLOUD | 하수진 |
| ML-Deep-Learning-Instance | Deep Learning Instance | 클라우드AI팀/CLOUD | 하수진 |
| Monitoring-Cloud-Monitoring | Cloud Monitoring | 모니터링플랫폼개발팀/CLOUD | 하수진 |
| NAT-Gateway | NAT Gateway | 네트워크인프라개발팀/CLOUD | 박선영 |
| NAT-Instance | NAT Instance | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network | Network | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-ACL | Network ACL | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-DNSPLUS | DNS Plus | 서비스개발팀/CLOUD | 박선영 |
| Network-Firewall | Network Firewall | 클라우드보안실/CLOUD | 박선영 |
| Network-Floating-IP | Floating IP | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-Flow-Log | Flow Log | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-Interface | Network Interface | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-Load-Balancer | Load Balancer | 네트워크인프라개발팀/CLOUD | 박선영 |
| Network-VPC | VPC | 네트워크인프라개발팀/CLOUD | 박선영 |
| NHN-Compliance | Security Compliance | 클라우드보안실/CLOUD | 박선영 |
| NHNBastion | NHN Bastion | 클라우드보안실/CLOUD | 박선영 |
| notification-hub | Notification Hub | 메시징플랫폼개발팀/CLOUD | 하수진 |
| OCR | OCR | AI서비스개발팀/NHN | 박선영 |
| Peering-Gateway | Peering Gateway | 네트워크인프라개발팀/CLOUD | 박선영 |
| pipeline | Pipeline | 성능보안개발팀/CLOUD | 하수진 |
| Private-DNS | Private DNS | 네트워크인프라개발팀/CLOUD | 박선영 |
| PrivateCA | Private CA | 성능보안개발팀/CLOUD | 하수진 |
| Push | Push | 메시징플랫폼개발팀/CLOUD | 하수진 |
| Quickstarts | 빠른 시작 가이드 | 테크니컬라이팅파트/CLOUD | 박선영 |
| RCS-Bizmessage | RCS Bizmessage | 메시징플랫폼개발팀/CLOUD | 하수진 |
| RDS | RDS for MySQL | 클라우드DB개발팀/CLOUD | 하수진 |
| RDS-FOR-MARIADB | RDS for MariaDB | 클라우드DB개발팀/CLOUD | 하수진 |
| RDS-FOR-POSTGRESQL | RDS for PostgreSQL | 클라우드DB개발팀/CLOUD | 하수진 |
| RDS-FOR-SQLSERVER | RDS for MS-SQL | 클라우드DB개발팀/CLOUD | 하수진 |
| ResourceWatcher | Resource Watcher | 빌링프레임워크개발팀/CLOUD | 박선영 |
| ROLE | ROLE | 서비스개발팀/CLOUD | 하수진 |
| Security-Advisor | Security Advisor | 클라우드보안실/CLOUD | 박선영 |
| Security-Check | App Security Check | 클라우드보안실/CLOUD | 박선영 |
| Security-Groups | Security Groups | 네트워크인프라개발팀/CLOUD | 박선영 |
| Security-Monitoring | Security Monitoring | 클라우드보안실/CLOUD | 박선영 |
| Security_VPN | SSL VPN | 클라우드보안실/CLOUD | 박선영 |
| Server-Security-Check | Server Security Check | 클라우드보안실/CLOUD | 박선영 |
| Service-Gateway | Service Gateway | 네트워크인프라개발팀/CLOUD | 박선영 |
| Service-Monitoring | Service Monitoring | 모니터링플랫폼개발팀/CLOUD | 하수진 |
| ShortURL | ShortURL | 모니터링플랫폼개발팀/CLOUD | 하수진 |
| SIEM | SIEM | 클라우드보안실/CLOUD | 박선영 |
| SMS | SMS | 메시징플랫폼개발팀/CLOUD | 하수진 |
| Storage-Backup | Backup | 서비스개발팀/CLOUD | 하수진 |
| Storage-Block-Storage | Block Storage | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Storage-Data-Transporter | Data Transporter | 컴퓨팅인프라개발팀/CLOUD | 하수진 |
| Storage-NAS | NAS (Offline) | 클라우드옵스2팀/CLOUD | 하수진 |
| Storage-NAS-For-Big-Data | NAS for BigData | 스토리지인프라개발팀/CLOUD | 하수진 |
| Storage-Object-Storage | Object Storage | 스토리지인프라개발팀/CLOUD | 하수진 |
| Storage-Online-NAS | NAS | 스토리지인프라개발팀/CLOUD | 하수진 |
| Storage-Storage-Gateway | Storage Gateway | 스토리지인프라개발팀/CLOUD | 하수진 |
| STT | Speech to Text | AI서비스개발팀/NHN | 박선영 |
| tibero-instance-guide | Tibero Instance | 데이터운영실/CLOUD | 하수진 |
| TOAST-bill | eTax | 재무시스템개발팀/CLOUD | 박선영 |
| TOAST-Cloud | NHN Cloud | 기획실 | 박선영 |
| Traffic-Mirroring | Traffic Mirroring | 네트워크인프라개발팀/CLOUD | 박선영 |
| Transit-Hub | Transit Hub | 네트워크인프라개발팀/CLOUD | 박선영 |
| TTS | Text to Speech | AI서비스개발팀/NHN | 박선영 |
| Vaccine | Vaccine | 클라우드보안실/CLOUD | 박선영 |
| VPN-Gateway | VPN Gateway(Site-to-Site VPN) | 네트워크인프라개발팀/CLOUD | 박선영 |
| WEB-Firewall | WEB Firewall | 클라우드보안실/CLOUD | 박선영 |
| Webshell-Threat-Detector | Webshell Threat Detector | 클라우드보안실/CLOUD | 박선영 |
