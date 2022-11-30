import { UserOperation } from "../entity/userOperation";
import { ethers } from "ethers";
export interface ITransaction {
    data: string;
    from: string;
    gas: string;
    to: string;
    value: string;
}
export declare class Converter {
    static fromTransaction(etherProvider: ethers.providers.BaseProvider, entryPointAddress: string, transcation: ITransaction, nonce?: number, maxFeePerGas?: number, maxPriorityFeePerGas?: number, paymasterAndData?: string): Promise<UserOperation | null>;
}
