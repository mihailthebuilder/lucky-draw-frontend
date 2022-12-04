import React from "react";
import styles from "./App.module.css";
import MetamaskInstalledView from "./components/MetamaskInstalledView";

import { EthereumProvider } from "./utils/provider";
import { getEthereumObjectFromWindow } from "./utils/window";

function App() {
  const eth = getEthereumObjectFromWindow();

  return (
    <div className={styles.App}>
      <header>
        <h1>Lucky Draw</h1>
      </header>
      <main>
        {eth ? (
          <MetamaskInstalledView provider={new EthereumProvider(eth)} />
        ) : (
          <p>Please install Metamask and log into it, then reload the page</p>
        )}
      </main>
    </div>
  );
}

export default App;
