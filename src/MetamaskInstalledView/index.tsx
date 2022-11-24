import React, { useEffect, useState } from "react";
import { providers } from "ethers";
import "./index.css";

import {
  getContractBalance,
  getWalletAddress,
  play,
  getContract,
} from "../helpers";

const MetamaskInstalledView = ({
  ethereumObjectInWindow,
}: {
  ethereumObjectInWindow: providers.ExternalProvider;
}) => {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [contractBalance, setContractBalance] = useState<number>();
  const [waitingForContractResponse, setWaitingForContractResponse] =
    useState(false);
  const [playedAtLeastOnce, setPlayedAtLeastOnce] = useState(false);
  const [wonTheDraw, setWonTheDraw] = useState<boolean>();

  const contract = getContract(ethereumObjectInWindow);

  const handlePlayClick = () => {
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
    getWalletAddress(ethereumObjectInWindow)
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
    <>
      <p>
        Your Metamask account address:{" "}
        {walletAddress ? walletAddress : "loading..."}
      </p>
      <p>Balance in contract: {contractBalance}</p>
      <button onClick={handlePlayClick}>Play</button>
      {playedAtLeastOnce &&
        (waitingForContractResponse ? (
          <div>Waiting for contract response</div>
        ) : (
          <div>Result of the draw is: you {wonTheDraw ? "won" : "lost"}!</div>
        ))}
    </>
  );
};

export default MetamaskInstalledView;
