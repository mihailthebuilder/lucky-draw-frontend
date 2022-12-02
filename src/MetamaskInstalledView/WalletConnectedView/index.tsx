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

        setContractBalance(undefined);
        getContractBalance(contract)
          .then((balance) => setContractBalance(balance))
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setWaitingForContractResponse(false);
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
        draws = draws.sort(
          (firstDraw, secondDraw) =>
            secondDraw.timestamp.getTime() - firstDraw.timestamp.getTime()
        );

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

      {playedAtLeastOnce &&
        (waitingForContractResponse ? (
          <h2>Waiting for contract response...</h2>
        ) : (
          <h2>Result of the draw is: you {wonTheDraw ? "won" : "lost"}!</h2>
        ))}

      {!waitingForContractResponse && (
        <button onClick={handlePlayClick}>Play</button>
      )}

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
