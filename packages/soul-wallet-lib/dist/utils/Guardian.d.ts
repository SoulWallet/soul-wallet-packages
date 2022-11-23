import { UserOperation } from "../entity/userOperation";
import { ethers } from "ethers";
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
    static grantGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
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
    static revokeGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
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
    static deleteGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
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
    static revokeGuardianConfirmation(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
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
    static grantGuardianConfirmation(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number): Promise<UserOperation | null>;
    static transferOwner(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, newOwner: string): Promise<UserOperation | null>;
    static packGuardiansSignByRequestId: typeof packGuardiansSignByRequestId;
}
