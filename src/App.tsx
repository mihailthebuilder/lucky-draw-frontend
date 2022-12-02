import React from "react";
import styles from "./App.module.css";
import MetamaskInstalledView from "./MetamaskInstalledView";

import { getEthereumObjectFromWindow } from "./helpers";

function App() {
  const eth = getEthereumObjectFromWindow();

  return (
    <div className={styles.App}>
      <header>
        <h1>Lucky Draw</h1>
      </header>
      <main>
        {eth ? (
          <MetamaskInstalledView ethereumObjectInWindow={eth} />
        ) : (
          <p>Please install Metamask and log into it, then reload the page</p>
        )}
      </main>
    </div>
  );
}

export default App;
