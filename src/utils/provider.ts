import { providers, Contract, ContractInterface } from "ethers";
import { LuckyDrawContract, LuckyDrawEthereumAPI } from "./contract";

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