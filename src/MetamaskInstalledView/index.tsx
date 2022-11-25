import React, { useEffect, useState } from "react";
import { providers } from "ethers";
import "./index.css";
import ContractInstalledView from "./ContractInstalledView";

import { connectWalletAndReturnItsAddress } from "../helpers";

const MetamaskInstalledView = ({
  ethereumObjectInWindow,
}: {
  ethereumObjectInWindow: providers.ExternalProvider;
}) => {
  const [walletAddress, setWalletAddress] = useState<string>();

  const connectWallet = () => {
    connectWalletAndReturnItsAddress(ethereumObjectInWindow)
      .then((address) => setWalletAddress(address))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <button onClick={connectWallet}>Connect wallet</button>

      {walletAddress && (
        <ContractInstalledView
          ethereumObjectInWindow={ethereumObjectInWindow}
          walletAddress={walletAddress}
        />
      )}
    </>
  );
};

export default MetamaskInstalledView;
