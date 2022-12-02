import React, { useEffect, useState } from "react";
import { providers } from "ethers";
import {
  getContractBalance,
  play,
  getContract,
  getAllDraws,
  Draw,
} from "../../helpers";
import styles from "./index.module.css";

type WalletConnectedViewProps = {
  ethereumObjectInWindow: providers.ExternalProvider;
  walletAddress: string;
};

const WalletConnectedView = (props: WalletConnectedViewProps) => {
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState(false);
  const [playedAtLeastOnce, setPlayedAtLeastOnce] = useState(false);
  const [wonTheDraw, setWonTheDraw] = useState<boolean>();
  const [draws, setDraws] = useState<Draw[]>([]);

  const handlePlayClick = () => {
    const contract = getContract(props.ethereumObjectInWindow);

    setWaitingForContractResponse(true);
    setPlayedAtLeastOnce(true);

    play(contract)
      .then((winningPlay) => {
        setWonTheDraw(winningPlay);
        setWaitingForContractResponse(false);

        setContractBalance(undefined);
        getContractBalance(contract)
          .then((balance) => setContractBalance(balance))
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const contract = getContract(props.ethereumObjectInWindow);

    getContractBalance(contract)
      .then((balance) => {
        setContractBalance(balance);
      })
      .catch((err) => {
        console.error(err);
      });

    getAllDraws(contract)
      .then((draws) => {
        setDraws(draws);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.ethereumObjectInWindow]);

  return (
    <>
      <p>Your Metamask account address: {props.walletAddress}</p>
      <p>Balance in contract: {contractBalance}</p>
      <button onClick={handlePlayClick}>Play</button>
      {playedAtLeastOnce &&
        (waitingForContractResponse ? (
          <p>Waiting for contract response...</p>
        ) : (
          <p>Result of the draw is: you {wonTheDraw ? "won" : "lost"}!</p>
        ))}

      <h2>Draws</h2>
      <div className={styles.drawContainer}>
        {draws.map((draw, index) => (
          <div key={index}>
            <p>From: {draw.from}</p>
            <p>Outcome: {draw.won ? "won" : "lost"}</p>
            <p>Old balance: {draw.oldBalance}</p>
            <p>New balance: {draw.newBalance}</p>
            <p>Datetime: {draw.timestamp.toISOString()}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default WalletConnectedView;
