import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

describe("given browser doesn't have MetaMask wallet", () => {
  test("render message asking for the account", () => {
    render(<App />);
    screen.getByText(/please add MetaMask to your browser/i);
  });
});

describe("given browser has MetaMask wallet", () => {
  beforeAll(() => {
    windowWithEthereumWallet.ethereum = { isMetaMask: true };
  });

  test("render happy path", () => {
    render(<App />);

    const connectWalletButton = screen.getByText(/connect wallet/i);
    expect(connectWalletButton.tagName.toLowerCase()).toEqual("button");

    screen.getByText(/total balance:/i);
  });
});
