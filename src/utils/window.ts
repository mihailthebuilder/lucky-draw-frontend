import { providers } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

const windowWithEthereumWallet = window as any as WindowWithEthereumWallet;

export const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;