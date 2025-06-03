import { Web3 } from "web3";

let web3: Web3;

export const initializeWeb3 = async () => {
  // MetaMask가 있는 경우
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
      web3 = new Web3(window.ethereum);
      console.log("MetaMask 연결 성공!");
      return true;
    } catch (error) {
      console.error("MetaMask 연결 거부됨:", error);
      return false;
    }
  }
  // MetaMask가 없는 경우 Infura 사용
  else {
    web3 = new Web3(
      "https://mainnet.infura.io/v3/d8d4d7b789ad4444ac1b72ab6d145259"
    );
    console.log("Infura로 연결됨 (읽기 전용)");
    return false;
  }
};

// Web3 초기화
initializeWeb3();

// 월렛 연결 상태 변경 감지
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length === 0) {
      console.log("월렛 연결이 해제되었습니다.");
    } else {
      console.log("연결된 계정:", accounts[0]);
    }
  });
}

export const getAccount = async (): Promise<string | null> => {
  if (!web3) return null;

  try {
    const accounts = await web3.eth.getAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error("계정 정보 조회 실패:", error);
    return null;
  }
};

export default web3;
