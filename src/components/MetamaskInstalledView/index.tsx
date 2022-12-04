import React, { useState } from "react";
import { providers } from "ethers";
import WalletConnectedView from "../WalletConnectedView";

import { connectWalletAndReturnItsAddress } from "../../utils/helpers";

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
      {walletAddress ? (
        <WalletConnectedView
          ethereumObjectInWindow={ethereumObjectInWindow}
          walletAddress={walletAddress}
        />
      ) : (
        <button onClick={connectWallet}>Connect wallet</button>
      )}
    </>
  );
};

export default MetamaskInstalledView;
