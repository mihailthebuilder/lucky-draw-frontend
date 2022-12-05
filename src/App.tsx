import React from "react";
import styles from "./App.module.css";
import MetamaskInstalledView from "./components/MetamaskInstalledView";

import { EthereumProvider } from "./utils/provider";
import { getProvider } from "./utils/window";

function App() {
  const provider = getProvider();

  return (
    <div className={styles.App}>
      <header>
        <h1>Lucky Draw</h1>
      </header>
      <main>
        {provider ? (
          <MetamaskInstalledView provider={new EthereumProvider(provider)} />
        ) : (
          <p>Please install Metamask and log into it, then reload the page</p>
        )}
      </main>
    </div>
  );
}

export default App;
