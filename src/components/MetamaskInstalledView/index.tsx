import React, { useState } from "react";
import WalletConnectedView from "../WalletConnectedView";

import { EthereumProvider } from "../../utils/provider";

const MetamaskInstalledView = ({
  provider,
}: {
  provider: EthereumProvider;
}) => {
  const [walletAddress, setWalletAddress] = useState<string>();

  const connectWallet = () => {
    provider
      .connectWalletAndReturnItsAddress()
      .then((address) => setWalletAddress(address))
      .catch((err) => console.log(err));
  };

  return (
    <>
      {walletAddress ? (
        <WalletConnectedView
          provider={provider}
          walletAddress={walletAddress}
        />
      ) : (
        <button onClick={connectWallet}>Connect wallet</button>
      )}
    </>
  );
};

export default MetamaskInstalledView;
