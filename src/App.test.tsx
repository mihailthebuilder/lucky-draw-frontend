import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);

  const connectWalletButton = screen.getByText(/connect wallet/i);
  expect(connectWalletButton.tagName.toLowerCase()).toEqual("button");

  screen.getByText(/total balance:/i);
});
