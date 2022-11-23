import React, { useEffect, useState } from "react";
import "./App.css";

import {
  getContractBalance,
  getEthereumObjectFromWindow,
  getWalletAddress,
} from "./helpers";

function App() {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState<boolean>();

  const handlePlayClick = () => {
    setWaitingForContractResponse(true);
  };

  useEffect(() => {
    const eth = getEthereumObjectFromWindow();

    getWalletAddress(eth)
      .then((account) => {
        setWalletAddress(account);
      })
      .catch((err) => {
        console.error(err);
      });

    getContractBalance(eth)
      .then((balance) => setContractBalance(balance))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Your Metamask account address: {walletAddress}</p>
        <p>Balance in contract: {contractBalance}</p>
        <button onClick={handlePlayClick}>Play</button>
        {waitingForContractResponse ? (
          <div>Waiting for contract response</div>
        ) : (
          <div>Result of the draw is: you won!</div>
        )}
      </header>
    </div>
  );
}

export default App;
