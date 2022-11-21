import React, { useEffect, useState } from "react";
import "./App.css";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

type AccountsInBrowser = string[];

const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

const getMetamaskAccount: () => Promise<string> = async () => {
  const eth = getEthereumObjectFromWindow();
  if (!eth?.request) {
    throw "No Ethereum object in window";
  }

  const accounts = (await eth.request({
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
    getMetamaskAccount()
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
            <p>Your Metamask account address: {metamaskAccount}</p>
            <p>Balance in contract: </p>
          </>
        ) : (
          <div>Please add MetaMask to your browser and set up a wallet</div>
        )}
      </header>
    </div>
  );
}

export default App;
