import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";

describe("given browser doesn't have ethereum object in window", () => {
  test("render message asking for the wallet", () => {
    render(<App />);
    screen.getByText(
      /please add MetaMask to your browser and set up a wallet/i
    );
  });
});

describe("given browser has ethereum object but no wallet", () => {
  beforeAll(() => {
    windowWithEthereumWallet.ethereum = {};
  });

  test("render message asking for the wallet", () => {
    render(<App />);
    screen.getByText(
      /please add MetaMask to your browser and set up a wallet/i
    );
  });
});

describe("given browser has MetaMask wallet", () => {
  beforeAll(() => {
    windowWithEthereumWallet.ethereum = {
      request: jest.fn(() => Promise.resolve({ data: ["hello"] })),
    };
  });

  test("render happy path", async () => {
    render(<App />);

    const connectWalletButton = screen.getByText(/connect wallet/i);
    expect(connectWalletButton.tagName.toLowerCase()).toEqual("button");

    screen.getByText(/total balance:/i);
  });
});
