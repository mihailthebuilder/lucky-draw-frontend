import React, { useEffect, useState } from "react";
import "./App.css";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

type AccountsInBrowser = string[];

const findMetamaskAccount: () => Promise<string> = async () => {
  const ethereumObjectFromWindow = windowWithEthereumWallet.ethereum;
  if (!ethereumObjectFromWindow?.request) {
    throw "No Ethereum object in window";
  }

  const accounts = (await ethereumObjectFromWindow.request({
    method: "eth_accounts",
  })) as AccountsInBrowser;

  if (accounts.length == 0) {
    throw "No authorised account found";
  }

  return accounts[0];
};

function App() {
  const [metamaskAccount, setMetamaskAccount] = useState<string>();

  useEffect(() => {
    findMetamaskAccount()
      .then((account) => {
        setMetamaskAccount(account);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {metamaskAccount ? (
          <>
            <button className="connect-wallet">Connect wallet</button>
            <div>Total balance:</div>
          </>
        ) : (
          <div>Please add MetaMask to your browser and set up a wallet</div>
        )}
      </header>
    </div>
  );
}

export default App;
