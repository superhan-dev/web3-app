# 프로젝트 설정 가이드

## 필수 요구사항

- Node.js 14.0.0 이상
- npm 또는 yarn
- MetaMask 브라우저 확장 프로그램

## 설치 방법

1. **프로젝트 클론**

   ```bash
   git clone <repository-url>
   cd web3-app
   ```

2. **의존성 설치**

   ```bash
   npm install
   # 또는
   yarn
   ```

3. **환경 변수 설정**
   ```bash
   # .env 파일 생성
   VITE_INFURA_PROJECT_ID=your_infura_project_id
   ```

## 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

## MetaMask 설정

1. [MetaMask 설치](https://metamask.io/download.html)
2. 새 지갑 생성 또는 기존 지갑 가져오기
3. 테스트넷 선택 (예: Goerli, Sepolia)

## 테스트 방법

1. 개발 서버 실행
2. 브라우저에서 `http://localhost:5173` 접속
3. "지갑 연결하기" 버튼 클릭
4. MetaMask 팝업에서 연결 승인

## 빌드 방법

```bash
npm run build
# 또는
yarn build
```

## 문제 해결

### 일반적인 문제

1. **MetaMask 연결 오류**

   - MetaMask가 설치되어 있는지 확인
   - 브라우저 새로고침
   - MetaMask 잠금 해제 확인

2. **트랜잭션 실패**

   - 네트워크 상태 확인
   - 가스비 충분한지 확인
   - 네트워크 선택이 올바른지 확인

3. **Web3 초기화 실패**
   - 콘솔 에러 메시지 확인
   - MetaMask 버전 확인
   - 브라우저 캐시 삭제 후 재시도

### 개발 환경 문제

1. **TypeScript 에러**

   ```bash
   npm install --save-dev @types/web3
   ```

2. **CORS 에러**
   - 개발 서버 설정 확인
   - Infura 프로젝트 설정 확인

## 배포 시 주의사항

1. **환경 변수**

   - 프로덕션 환경 변수 설정
   - 민감한 정보 보호

2. **네트워크 설정**

   - 프로덕션용 네트워크 선택
   - fallback provider 설정

3. **보안**
   - HTTPS 사용
   - CSP(Content Security Policy) 설정
   - 입력값 검증
