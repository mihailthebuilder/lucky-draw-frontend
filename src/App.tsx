import React, { useEffect } from "react";
import "./App.css";

import { providers } from "ethers";

type WindowWithWallet = {
  ethereum: providers.ExternalProvider;
};

const getEthereumObject = (window: WindowWithWallet) => window.ethereum;

function App() {
  useEffect(() => {
    console.log(getEthereumObject(window as any as WindowWithWallet));
  });

  return (
    <div className="App">
      <header className="App-header">
        <button className="connect-wallet">Connect wallet</button>
        <div>Total balance:</div>
      </header>
    </div>
  );
}

export default App;
