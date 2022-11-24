import React, { useEffect, useState } from "react";
import "./App.css";

import {
  getContractBalance,
  getEthereumObjectFromWindow,
  getWalletAddress,
  play,
  getContract,
} from "./helpers";

function App() {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState(false);
  const [playedAtLeastOnce, setPlayedAtLeastOnce] = useState(false);
  const [wonTheDraw, setWonTheDraw] = useState<boolean>();

  const eth = getEthereumObjectFromWindow();
  const contract = getContract(eth);

  const handlePlayClick = () => {
    setWaitingForContractResponse(true);
    setPlayedAtLeastOnce(true);

    play(contract)
      .then((winningPlay) => {
        setWaitingForContractResponse(false);
        setWonTheDraw(winningPlay);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getWalletAddress(eth)
      .then((address) => {
        setWalletAddress(address);
      })
      .catch((err) => {
        console.error(err);
      });

    getContractBalance(contract)
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
        {playedAtLeastOnce &&
          (waitingForContractResponse ? (
            <div>Waiting for contract response</div>
          ) : (
            <div>Result of the draw is: you {wonTheDraw ? "won" : "lost"}!</div>
          ))}
      </header>
    </div>
  );
}

export default App;
