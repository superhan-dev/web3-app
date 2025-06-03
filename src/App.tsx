import React, { useEffect, useState } from "react";
import web3, { getAccount, initializeWeb3 } from "./my-web3";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const connectWallet = async () => {
      try {
        setIsLoading(true);
        await initializeWeb3();
        const currentAccount = await getAccount();
        setAccount(currentAccount);
        if (currentAccount && web3) {
          const balanceWei = await web3.eth.getBalance(currentAccount);
          setBalance(web3.utils.fromWei(balanceWei, "ether"));
        }
      } catch (error) {
        console.error("월렛 연결 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    connectWallet();

    // 계정 변경 감지
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        const newAccount = accounts[0] || null;
        setAccount(newAccount);
        if (newAccount && web3) {
          const balanceWei = await web3.eth.getBalance(newAccount);
          setBalance(web3.utils.fromWei(balanceWei, "ether"));
        } else {
          setBalance("0");
        }
      });
    }
  }, []);

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      // MetaMask 설치 페이지로 이동
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      await initializeWeb3();
      const currentAccount = await getAccount();
      setAccount(currentAccount);
      if (currentAccount && web3) {
        const balanceWei = await web3.eth.getBalance(currentAccount);
        setBalance(web3.utils.fromWei(balanceWei, "ether"));
      }
    } catch (error) {
      console.error("월렛 연결 실패:", error);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="app">
      <header>
        {account ? (
          <div className="wallet-info">
            <p>연결된 지갑: {account}</p>
            <p>잔액: {balance} ETH</p>
          </div>
        ) : (
          <button onClick={handleConnectWallet} className="connect-wallet-btn">
            {window.ethereum ? "지갑 연결하기" : "MetaMask 설치하기"}
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
