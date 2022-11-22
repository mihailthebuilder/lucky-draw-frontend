import contractJson from "./LuckyDraw.json";

import { providers, Contract, BigNumber } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

export const windowWithEthereumWallet = window as any as WindowWithEthereumWallet;

type AccountsInBrowser = string[];

const contractAddress = "0x9425F287aEb94d46FeBfF996b0DbCf78E52c9D05";

const contractABI = contractJson.abi;

export const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

export const getWalletAddress: (
    ethereumObjectFromWindow: providers.ExternalProvider
) => Promise<string> = async (eth) => {
    if (!eth?.request) {
        throw "No Ethereum object in window";
    }

    const accounts = (await eth.request({
        method: "eth_accounts",
    })) as AccountsInBrowser;

    if (accounts.length == 0) {
        throw "No authorised account found";
    }

    return accounts[0];
};

export const getContractBalance: (
    ethereumObjectFromWindow: providers.ExternalProvider
) => Promise<number> = async (eth) => {
    const provider = new providers.Web3Provider(eth);
    const signer = provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    const balance = contract.balance() as Promise<BigNumber>;

    return (await balance).toNumber();
};