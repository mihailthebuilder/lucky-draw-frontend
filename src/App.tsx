import React from "react";
import "./App.css";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {getEthereumObjectFromWindow() ? (
          <>
            <button className="connect-wallet">Connect wallet</button>
            <div>Total balance:</div>
          </>
        ) : (
          <div>Please add MetaMask to your browser</div>
        )}
      </header>
    </div>
  );
}

export default App;
