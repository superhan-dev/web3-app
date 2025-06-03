# Web3 지갑 연동 프로젝트

이 프로젝트는 React와 Web3.js를 사용하여 이더리움 지갑(MetaMask)을 웹 애플리케이션에 연동하는 예제입니다.

## 기능

- MetaMask 지갑 연결
- 계정 잔액 조회
- 실시간 계정 변경 감지
- 지갑 미설치 시 설치 안내

## 기술 스택

- React
- TypeScript
- Web3.js
- MetaMask Provider

## 프로젝트 구조

```
src/
├── App.tsx          # 메인 애플리케이션 컴포넌트
├── my-web3.ts       # Web3 초기화 및 유틸리티 함수
└── types/
    └── window.d.ts  # 전역 타입 선언
```

## 주요 구현 사항

### 1. Web3 초기화 (`my-web3.ts`)

```typescript
export const initializeWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
      web3 = new Web3(window.ethereum);
      return true;
    } catch (error) {
      console.error("MetaMask 연결 거부됨:", error);
      return false;
    }
  } else {
    web3 = new Web3("https://mainnet.infura.io/v3/...");
    return false;
  }
};
```

### 2. 지갑 연결 관리 (`App.tsx`)

```typescript
const handleConnectWallet = async () => {
  if (!window.ethereum) {
    window.open("https://metamask.io/download.html", "_blank");
    return;
  }

  try {
    await initializeWeb3();
    const currentAccount = await getAccount();
    setAccount(currentAccount);
  } catch (error) {
    console.error("월렛 연결 실패:", error);
  }
};
```

### 3. 이벤트 리스너 (`App.tsx`)

```typescript
useEffect(() => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
      const newAccount = accounts[0] || null;
      setAccount(newAccount);
    });
  }
}, []);
```

## MetaMask 연동 원리

1. **Provider 주입**

   - MetaMask 익스텐션이 `window.ethereum` 객체를 웹페이지에 주입
   - EIP-1193 표준을 따르는 이더리움 Provider 제공

2. **연결 프로세스**

   - 사용자가 연결 버튼 클릭
   - MetaMask 팝업으로 권한 요청
   - 승인 시 계정 접근 권한 획득

3. **상태 관리**
   - 계정 변경 감지
   - 네트워크 변경 감지
   - 연결 상태 모니터링

## 보안 고려사항

1. **개인키 보호**

   - 개인키는 MetaMask 내부에만 저장
   - dApp은 직접 접근 불가

2. **트랜잭션 승인**

   - 모든 트랜잭션은 MetaMask UI를 통한 사용자 승인 필요
   - 자동 실행 방지

3. **Provider 검증**
   - `isMetaMask` 플래그로 진짜 MetaMask provider 확인
   - 악의적인 provider 주입 방지

## 향후 개선사항

1. 다중 지갑 지원
2. 트랜잭션 히스토리 표시
3. 토큰 전송 기능 구현
4. 네트워크 전환 기능
5. 에러 처리 개선

## 참고 자료

- [MetaMask 문서](https://docs.metamask.io/)
- [Web3.js 문서](https://web3js.readthedocs.io/)
- [EIP-1193 명세](https://eips.ethereum.org/EIPS/eip-1193)
