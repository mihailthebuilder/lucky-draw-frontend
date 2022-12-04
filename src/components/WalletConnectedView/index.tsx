import React, { useEffect, useState } from "react";
import { Draw, LuckyDrawContract } from "../../utils/contract";
import { EthereumProvider } from "../../utils/provider";
import contractJson from "../../utils/LuckyDraw.json";
import styles from "./index.module.css";

const WalletConnectedView = (props: WalletConnectedViewProps) => {
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState(false);
  const [playedAtLeastOnce, setPlayedAtLeastOnce] = useState(false);
  const [resultOfDrawMessage, setResultOfDrawMessage] = useState("");
  const [draws, setDraws] = useState<Draw[]>([]);

  const updateDraws = (contract: LuckyDrawContract) => {
    contract
      .getAllDraws()
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
  };

  const handlePlayClick = () => {
    const contract = props.provider.getContract(contractAddress, contractABI);

    setWaitingForContractResponse(true);
    setPlayedAtLeastOnce(true);

    contract
      .play()
      .then((winningPlay) => {
        const message = `Result of the draw is: you ${
          winningPlay ? "won" : "lost"
        }`;

        setResultOfDrawMessage(message);

        setContractBalance(undefined);

        contract
          .getBalance()
          .then((balance) => setContractBalance(balance))
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        setResultOfDrawMessage("Something went wrong, try again!");
        console.log(err);
      })
      .finally(() => {
        updateDraws(contract);
        setWaitingForContractResponse(false);
      });
  };

  useEffect(() => {
    const contract = props.provider.getContract(contractAddress, contractABI);

    contract
      .getBalance()
      .then((balance) => {
        setContractBalance(balance);
      })
      .catch((err) => {
        console.error(err);
      });

    updateDraws(contract);
  }, [props.provider]);

  return (
    <>
      <p>Your Metamask account address: {props.walletAddress}</p>
      <p>Balance in contract: {contractBalance}</p>

      {playedAtLeastOnce &&
        (waitingForContractResponse ? (
          <h2>Waiting for contract response...</h2>
        ) : (
          <h2>{resultOfDrawMessage}</h2>
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

type WalletConnectedViewProps = {
  provider: EthereumProvider;
  walletAddress: string;
};

const contractAddress = "0xa2791C77282106b171e1133f8ACD0E597e0e9ceb";

const contractABI = contractJson.abi;

export default WalletConnectedView;
