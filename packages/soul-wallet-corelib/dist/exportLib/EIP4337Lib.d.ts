import { TransactionInfo } from "../entity/transactionInfo";
import { UserOperation } from "../entity/userOperation";
import { AbiItem } from 'web3-utils';
export declare class EIP4337Lib {
    /**
     * User Operation
     */
    static UserOperation: typeof UserOperation;
    /**
     * calculate EIP-4337 wallet address
     * @param initCode the init code
     * @param jsonInterface the jsonInterface of the contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddressByCode(initCode: string, jsonInterface: AbiItem | AbiItem[], initArgs: any[] | undefined, salt: number, create2Factory?: string): string;
    /**
     * calculate EIP-4337 wallet address
     * @param initCodeHash the init code after keccak256
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns the EIP-4337 wallet address
     */
    static calculateWalletAddressByCodeHash(initCodeHash: string, salt: number, create2Factory?: string): string;
    /**
     * update gas
     * @param entryPoint the entryPoint address
     * @param userOperation the userOperation to update
     * @param estimateGasFunc  the function to estimate gas
     */
    static estimateGas(entryPoint: string, userOperation: UserOperation, estimateGasFunc: (txInfo: TransactionInfo) => Promise<number>): Promise<void>;
    /**
     * Sign the userOperation with the given private key
     * @param userOperation the userOperation to sign
     * @param privateKey private key
     */
    static signUserOp(userOperation: UserOperation, privateKey: string): void;
}
