import React, { useEffect, useState } from "react";
import { providers } from "ethers";
import {
  getContractBalance,
  play,
  getContract,
  getAllDraws,
  EventParameters,
} from "../../helpers";

type WalletInstalledViewProps = {
  ethereumObjectInWindow: providers.ExternalProvider;
  walletAddress: string;
};

const WalletInstalledView = (props: WalletInstalledViewProps) => {
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState(false);
  const [playedAtLeastOnce, setPlayedAtLeastOnce] = useState(false);
  const [wonTheDraw, setWonTheDraw] = useState<boolean>();
  const [draws, setDraws] = useState<EventParameters[]>([]);

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

      {draws.map((draw) => (
        <div key={draw.timestamp.toNumber()}>
          <p>{draw.from}</p>
        </div>
      ))}
    </>
  );
};

export default WalletInstalledView;
