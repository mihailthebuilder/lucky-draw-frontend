import React from "react";
import "./App.css";
import WalletLoadedView from "./WalletLoadedView";

import { getEthereumObjectFromWindow } from "./helpers";

function App() {
  const eth = getEthereumObjectFromWindow();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lucky Draw</h1>
      </header>
      <main>
        {eth ? (
          <WalletLoadedView ethereumObjectInWindow={eth} />
        ) : (
          <p>Please install Metamask and log into it, then reload the page</p>
        )}
      </main>
    </div>
  );
}

export default App;
