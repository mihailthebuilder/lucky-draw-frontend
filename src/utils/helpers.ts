import { providers, Contract, BigNumber, utils, BigNumberish, ContractInterface } from "ethers";

type WindowWithEthereumWallet = {
    ethereum: providers.ExternalProvider;
};

export const windowWithEthereumWallet = window as any as WindowWithEthereumWallet;

export type LuckyDrawEthereumAPI = {
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
    newBalance: BigNumber,
    oldBalance: BigNumber
}

export type Draw = {
    from: string,
    timestamp: Date,
    won: boolean,
    newBalance: number,
    oldBalance: number
}

export const getEthereumObjectFromWindow = () => windowWithEthereumWallet.ethereum;

const convertWeiToEther = (wei: BigNumberish) => Number(utils.formatEther(wei));

export class EthereumProvider {
    provider: providers.ExternalProvider;

    constructor(provider: providers.ExternalProvider) {
        this.provider = provider;
    }

    async connectWalletAndReturnItsAddress() {
        if (!this.provider?.request) {
            throw new Error("No Ethereum object in window");
        }

        const addessesOfAccountsInBrowser = await this.provider.request({
            method: "eth_requestAccounts",
        }) as string[];

        if (addessesOfAccountsInBrowser.length > 0) {
            return addessesOfAccountsInBrowser[0]
        }

        throw new Error("No valid account found");
    };

    getContract(address: string, abi: ContractInterface) {
        const provider = new providers.Web3Provider(this.provider);
        const signer = provider.getSigner();
        const contract = new Contract(address, abi, signer) as any as LuckyDrawEthereumAPI;
        return new LuckyDrawContract(contract);
    }
}

export class LuckyDrawContract {
    contract: LuckyDrawEthereumAPI;

    constructor(contract: LuckyDrawEthereumAPI) {
        this.contract = contract;
    }

    async getBalance() {
        const balanceInWei = await this.contract.provider.getBalance(this.contract.address);
        return convertWeiToEther(balanceInWei);
    }


    play: () => Promise<boolean> = async () => {
        const transaction = await this.contract.draw();
        const transactionResult = await transaction.wait();
        const eventsResultingFromTransaction = transactionResult.events;

        if (eventsResultingFromTransaction?.length !== 1) {
            throw new Error("No events emitted")
        }

        return eventsResultingFromTransaction[0].args.won;
    }

    getAllDraws: () => Promise<Draw[]> = async () => {
        const eventFilter = this.contract.filters["NewDraw(address,uint256,bool,uint256,uint256)"]()
        const events = await this.contract.queryFilter(eventFilter)
        const parsedEvents = events.map((event) => {
            const rawEvent = event?.args as unknown as EventParameters
            return {
                from: rawEvent.from,
                timestamp: new Date(rawEvent.timestamp.toNumber() * 1000),
                won: rawEvent.won,
                newBalance: convertWeiToEther(rawEvent.newBalance),
                oldBalance: convertWeiToEther(rawEvent.oldBalance)
            }
        })
        return parsedEvents
    }
}