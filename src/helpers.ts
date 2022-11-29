import contractJson from "./LuckyDraw.json";

import { providers, Contract, BigNumber } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

export const windowWithEthereumWallet = window as any as WindowWithEthereumWallet;

type LuckyDrawContract = {
    balance(): Promise<BigNumber>
    draw(): Promise<Transaction>
} & Contract

type Transaction = {
    wait(): Promise<TransactionResult>
}

type TransactionResult = {
    events?: Event[]
}

type Event = {
    args: EventParameters
}

type EventParameters = {
    from: string,
    timestamp: BigNumber,
    won: boolean,
    newBalance: number,
    oldBalance: number
}

export type Draw = {
    from: string,
    timestamp: Date,
    won: boolean,
    newBalance: number,
    oldBalance: number
}

const contractAddress = "0xE8e9b6be92d7cf6ca4869D571894DCd607d4211D";

const contractABI = contractJson.abi;

export const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

export const getContractBalance = async (contract: LuckyDrawContract) => {
    const balance = contract.balance();
    return (await balance).toNumber();
};

export const play: (contract: LuckyDrawContract) => Promise<boolean> = async (contract) => {
    const transaction = await contract.draw();
    const transactionResult = await transaction.wait();
    const eventsResultingFromTransaction = transactionResult.events;

    if (eventsResultingFromTransaction?.length !== 1) {
        throw new Error("No events emitted")
    }

    return eventsResultingFromTransaction[0].args.won;
}

export const getContract = (ethereumObjectFromWindow: providers.ExternalProvider) => {
    const provider = new providers.Web3Provider(ethereumObjectFromWindow);
    const signer = provider.getSigner();
    return new Contract(contractAddress, contractABI, signer) as any as LuckyDrawContract;
}

export const connectWalletAndReturnItsAddress = async (ethereumObjectFromWindow: providers.ExternalProvider) => {
    if (!ethereumObjectFromWindow?.request) {
        throw new Error("No Ethereum object in window");
    }

    const addessesOfAccountsInBrowser = await ethereumObjectFromWindow.request({
        method: "eth_requestAccounts",
    }) as string[];

    if (addessesOfAccountsInBrowser.length > 0) {
        return addessesOfAccountsInBrowser[0]
    }

    throw new Error("No valid account found");
};

export const getAllDraws: (contract: LuckyDrawContract) => Promise<Draw[]> = async (contract) => {
    const eventFilter = contract.filters["NewDraw(address,uint256,bool,uint256,uint256)"]()
    const events = await contract.queryFilter(eventFilter)
    const parsedEvents = events.map((event) => {
        const rawEvent = event?.args as unknown as EventParameters
        return {
            from: rawEvent.from,
            timestamp: new Date(rawEvent.timestamp.toNumber() * 1000),
            won: rawEvent.won,
            newBalance: rawEvent.newBalance,
            oldBalance: rawEvent.oldBalance
        }
    })
    return parsedEvents
}