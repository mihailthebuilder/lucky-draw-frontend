import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

const ethereumMock = {
  ethereum: { isMetaMask: true },
};

jest.mock("./windowWithEthereumWallet", () => {
  return { getWindowWithEthereumWallet: () => ethereumMock };
});

describe("", () => {
  test("given ethereum account in browser, render happy path", () => {
    render(<App />);

    const connectWalletButton = screen.getByText(/connect wallet/i);
    expect(connectWalletButton.tagName.toLowerCase()).toEqual("button");

    screen.getByText(/total balance:/i);
  });
});

describe("", () => {
  test("given ethereum account not in browser, render message asking for the acocunt", () => {
    render(<App />);
    screen.getByText(/please add MetaMask to your browser/i);
  });
});
