import { providers } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

export function getWindowWithEthereumWallet(): WindowWithEthereumWallet {
    return window as any as WindowWithEthereumWallet;
}