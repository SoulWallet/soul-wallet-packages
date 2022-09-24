import { UserOperation } from "../entity/userOperation";
import Web3 from "web3";
import { packGuardiansSignByRequestId } from "../utils/userOp";
export declare class Guaridian {
    private static walletContract;
    private static _guardian;
    /**
     * grant guardian request
     * @param web3
     * @param walletAddress
     * @param nonce
     * @param guardianAddress
     * @param entryPointAddress
     * @param paymasterAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @returns unsigned UserOperation
     */
    static grantGuardianRequest(web3: Web3, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    /**
     * revoke guardian request
     * @param web3
     * @param walletAddress
     * @param nonce
     * @param guardianAddress
     * @param entryPointAddress
     * @param paymasterAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @returns  unsigned UserOperation
     */
    static revokeGuardianRequest(web3: Web3, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    /**
     * delete guardian request
     * @param web3
     * @param walletAddress
     * @param nonce
     * @param guardianAddress
     * @param entryPointAddress
     * @param paymasterAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @returns  unsigned UserOperation
     */
    static deleteGuardianRequest(web3: Web3, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    /**
     * revoke guardian confirmation
     * @param web3
     * @param walletAddress
     * @param nonce
     * @param guardianAddress
     * @param entryPointAddress
     * @param paymasterAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @returns  unsigned UserOperation
     */
    static revokeGuardianConfirmation(web3: Web3, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    /**
     * delete guardian confirmation
     * @param web3
     * @param walletAddress
     * @param nonce
     * @param guardianAddress
     * @param entryPointAddress
     * @param paymasterAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @returns  unsigned UserOperation
     */
    static grantGuardianConfirmation(web3: Web3, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    static transferOwner(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, newOwner: string): Promise<UserOperation | null>;
    static packGuardiansSignByRequestId: typeof packGuardiansSignByRequestId;
}
