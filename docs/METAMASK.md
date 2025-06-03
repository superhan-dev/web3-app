# MetaMask 연동 기술 문서

## MetaMask 개요

MetaMask는 이더리움 블록체인과 상호작용할 수 있게 해주는 브라우저 확장 프로그램입니다. 이 문서에서는 MetaMask의 작동 원리와 웹 애플리케이션과의 연동 방법을 설명합니다.

## Provider 주입 원리

### 1. window.ethereum 객체

MetaMask는 웹페이지가 로드될 때 `window.ethereum` 객체를 자동으로 주입합니다.

```typescript
interface Window {
  ethereum?: {
    isMetaMask: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: Function) => void;
    removeListener: (eventName: string, callback: Function) => void;
    // ... 기타 메서드들
  };
}
```

### 2. Provider 검증

```typescript
// MetaMask provider 확인
if (window.ethereum?.isMetaMask) {
  // 안전한 MetaMask provider
} else {
  // 다른 provider나 가짜 provider일 수 있음
}
```

## 주요 기능 및 메서드

### 1. 계정 연결

```typescript
// 기본 연결 방법
await window.ethereum.request({
  method: "eth_requestAccounts",
});

// 또는 enable() 메서드 사용
await window.ethereum.enable();
```

### 2. 네트워크 관리

```typescript
// 현재 네트워크 ID 조회
const chainId = await window.ethereum.request({
  method: "eth_chainId",
});

// 네트워크 전환 요청
await window.ethereum.request({
  method: "wallet_switchEthereumChain",
  params: [{ chainId: "0x1" }], // Mainnet
});
```

### 3. 트랜잭션 처리

```typescript
// 트랜잭션 전송
const txHash = await window.ethereum.request({
  method: "eth_sendTransaction",
  params: [
    {
      from: account,
      to: receiverAddress,
      value: "0x0", // 16진수 형태의 값
      gas: "0x5208", // 21000
    },
  ],
});
```

## 이벤트 시스템

### 1. 계정 변경 감지

```typescript
window.ethereum.on("accountsChanged", (accounts: string[]) => {
  if (accounts.length === 0) {
    // 연결 해제됨
  } else {
    // 새 계정으로 변경됨
    const newAccount = accounts[0];
  }
});
```

### 2. 네트워크 변경 감지

```typescript
window.ethereum.on("chainChanged", (chainId: string) => {
  // 페이지 새로고침 권장
  window.location.reload();
});
```

### 3. 연결 상태 감지

```typescript
window.ethereum.on("connect", (connectInfo: { chainId: string }) => {
  // 연결됨
});

window.ethereum.on("disconnect", (error: { code: number; message: string }) => {
  // 연결 해제됨
});
```

## 보안 고려사항

### 1. 개인키 보호

- MetaMask는 절대로 개인키를 웹 애플리케이션에 노출하지 않습니다
- 모든 서명 작업은 MetaMask UI를 통해 이루어집니다

### 2. 트랜잭션 보안

```typescript
// 항상 사용자 확인이 필요
const sendTransaction = async () => {
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transaction],
    });
    // 트랜잭션이 승인됨
  } catch (error) {
    if (error.code === 4001) {
      // 사용자가 거부함
    }
  }
};
```

### 3. 네트워크 보안

```typescript
// 항상 현재 네트워크 확인
const checkNetwork = async () => {
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });
  if (chainId !== expectedChainId) {
    throw new Error("잘못된 네트워크");
  }
};
```

## 에러 처리

### 1. 일반적인 에러 코드

```typescript
const ERROR_CODES = {
  4001: '사용자가 요청을 거부했습니다',
  -32602: '매개변수가 잘못되었습니다',
  -32603: '내부 오류',
};

try {
  // MetaMask 요청
} catch (error) {
  console.error(ERROR_CODES[error.code] || '알 수 없는 오류');
}
```

### 2. 연결 오류 처리

```typescript
const connectWallet = async () => {
  try {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (error) {
    switch (error.code) {
      case 4001:
        console.log("연결이 거부되었습니다");
        break;
      case -32002:
        console.log("이미 처리 중인 요청이 있습니다");
        break;
      default:
        console.error("연결 오류:", error);
    }
  }
};
```

## 모범 사례

1. **이벤트 정리**

```typescript
useEffect(() => {
  const handleAccountsChanged = (accounts: string[]) => {
    // 처리 로직
  };

  window.ethereum.on("accountsChanged", handleAccountsChanged);

  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  };
}, []);
```

2. **네트워크 확인**

```typescript
const checkAndSwitchNetwork = async (requiredChainId: string) => {
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChainId !== requiredChainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requiredChainId }],
      });
    } catch (error) {
      // 네트워크가 없는 경우 추가
      if (error.code === 4902) {
        // 네트워크 추가 로직
      }
    }
  }
};
```

3. **상태 관리**

```typescript
const [walletState, setWalletState] = useState({
  isConnected: false,
  account: null,
  chainId: null,
  balance: "0",
});

// 상태 업데이트 함수
const updateWalletState = async () => {
  if (!window.ethereum) return;

  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  setWalletState({
    isConnected: accounts.length > 0,
    account: accounts[0] || null,
    chainId,
    balance: accounts[0] ? await getBalance(accounts[0]) : "0",
  });
};
```
