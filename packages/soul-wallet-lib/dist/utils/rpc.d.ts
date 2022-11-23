import Web3 from "web3";
import { ethers } from "ethers";
import { UserOperation } from "../entity/userOperation";
export declare class RPC {
    static eth_sendUserOperation(op: UserOperation, entryPointAddress: string): string;
    static eth_supportedEntryPoints(): string;
    /**
     * wait for the userOp to be mined
     * @param web3 web3 instance
     * @param entryPointAddress the entryPoint address
     * @param requestId the requestId
     * @param timeOut the time out, default:1000 * 60 * 10 ( 10 minutes)
     * @param fromBlock the fromBlock, default: latest - 5
     * @returns the userOp event array
     */
    static waitUserOperationWeb3(web3: Web3, entryPointAddress: string, requestId: string, timeOut?: number, fromBlock?: number): Promise<EventData[]>;
    /**
     * wait for the userOp to be mined
     * @param provider ethers provider
     * @param entryPointAddress the entryPoint address
     * @param requestId the requestId
     * @param timeOut the time out, default:1000 * 60 * 10 ( 10 minutes)
     * @param fromBlock the fromBlock, default: latest - 5
     * @returns the userOp event array
     */
    static waitUserOperationEther(provider: ethers.providers.BaseProvider, entryPointAddress: string, requestId: string, timeOut?: number, fromBlock?: number): Promise<EventData[] | Array<ethers.Event>>;
}
export interface EventData {
    returnValues: {
        [key: string]: any;
    };
    raw: {
        data: string;
        topics: string[];
    };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}
