import contractJson from "./LuckyDraw.json";

import { providers, Contract, BigNumber } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

export const windowWithEthereumWallet = window as any as WindowWithEthereumWallet;

type AccountsInBrowser = string[];

const contractAddress = "0xf48258Cd6a4C43185Df7D192bEc56983315A5c04";

const contractABI = contractJson.abi;

export const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

export const getWalletAddress = async (ethereumObjectFromWindow: providers.ExternalProvider) => {
    if (!ethereumObjectFromWindow?.request) {
        throw "No Ethereum object in window";
    }

    const accounts = (await ethereumObjectFromWindow.request({
        method: "eth_accounts",
    })) as AccountsInBrowser;

    if (accounts.length == 0) {
        throw "No authorised account found";
    }

    return accounts[0];
};

export const getContractBalance = async (ethereumObjectFromWindow: providers.ExternalProvider) => {
    const provider = new providers.Web3Provider(ethereumObjectFromWindow);
    const signer = provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    const balance = contract.balance() as Promise<BigNumber>;

    return (await balance).toNumber();
};