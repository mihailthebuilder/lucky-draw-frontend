import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

import { windowWithEthereumWallet } from "./windowWithEthereumWallet";
import { act } from "react-dom/test-utils";

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
      request: () => Promise.resolve(["account1"]),
    };
  });

  test("render happy path", async () => {
    await act(() => {
      render(<App />);
    });

    screen.getByText(/your metamask account address: account1/i);
  });
});
