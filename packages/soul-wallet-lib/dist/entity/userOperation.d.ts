import { TransactionInfo } from './transactionInfo';
/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol
 */
declare class UserOperation {
    sender: string;
    nonce: number;
    initCode: string;
    callData: string;
    callGas: number;
    verificationGas: number;
    preVerificationGas: number;
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;
    paymaster: string;
    paymasterData: string;
    signature: string;
    clone(): UserOperation;
    toTuple(): string;
    /**
     * estimate the gas
     * @param entryPointAddress the entry point address
     * @param estimateGasFunc the estimate gas function
     * @returns false if failed
     */
    estimateGas(entryPointAddress: string, estimateGasFunc: (txInfo: TransactionInfo) => Promise<number>): Promise<boolean>;
    /**
     * get the paymaster sign hash
     * @returns
     */
    payMasterSignHash(): string;
    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    sign(entryPoint: string, chainId: number, privateKey: string): void;
    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    keystoreSign(entryPoint: string, chainId: number, signAddress: string, keyStoreSign: (message: string) => Promise<string | null>): Promise<boolean>;
}
export { UserOperation };
