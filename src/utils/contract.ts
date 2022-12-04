import { Contract, BigNumber, utils, BigNumberish } from "ethers";

export class LuckyDrawContract {
    private contract: LuckyDrawEthereumAPI;

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

const convertWeiToEther = (wei: BigNumberish) => Number(utils.formatEther(wei));