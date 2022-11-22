import React, { useEffect, useState } from "react";
import contractJson from "./LuckyDraw.json";
import "./App.css";
import { providers, Contract, BigNumber } from "ethers";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

type AccountsInBrowser = string[];

const contractAddress = "0x9425F287aEb94d46FeBfF996b0DbCf78E52c9D05";

const contractABI = contractJson.abi;

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
  const [contractBalance, setContractBalance] = useState<number>();

  useEffect(() => {
    getMetamaskAccount()
      .then((account) => {
        setMetamaskAccount(account);

        const eth = getEthereumObjectFromWindow();
        const provider = new providers.Web3Provider(eth);
        const signer = provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);

        (contract.balance() as Promise<any>)
          .then((val: BigNumber) => setContractBalance(val.toNumber()))
          .catch((err) => {
            console.error(err);
          });
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
            <p>Balance in contract: {contractBalance}</p>
          </>
        ) : (
          <div>Please add MetaMask to your browser and set up a wallet</div>
        )}
      </header>
    </div>
  );
}

export default App;
