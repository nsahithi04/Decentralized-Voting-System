// src/hooks/useWallet.js
import { useEffect, useState } from "react";

export default function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const hasProvider = typeof window !== 'undefined' && !!window.ethereum;

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accs) => {
      setAccount(accs.length ? accs[0] : null);
    };

    const handleChainChanged = (_chainId) => {
      setChainId(_chainId);
      window.location.reload();
    };

    window.ethereum.request({ method: "eth_accounts" }).then(handleAccountsChanged);
    window.ethereum.request({ method: "eth_chainId" }).then(setChainId);

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accs[0]);
  };

  return {
    account,
    chainId,
    isConnected: !!account,
    hasProvider,
    connect,
  };
}
