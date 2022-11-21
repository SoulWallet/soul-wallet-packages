import { UserOperation } from "../entity/userOperation";
export interface ITransaction {
    data: string;
    from: string;
    gas: string;
    to: string;
    value: string;
}
export declare class Converter {
    static fromTransaction(transcation: ITransaction, nonce?: number, maxFeePerGas?: number, maxPriorityFeePerGas?: number, paymasterAndData?: string): UserOperation;
}
