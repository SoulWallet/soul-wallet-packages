/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */
import { UserOperation } from '../entity/userOperation';
import { ethers } from "ethers";
export declare function packUserOp(op: UserOperation, forSignature?: boolean): string;
export declare function getRequestId(op: UserOperation, entryPointAddress: string, chainId: number): string;
/**
 * sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param privateKey
 * @returns signature
 */
export declare function signUserOp(op: UserOperation, entryPointAddress: string, chainId: number, privateKey: string): string;
/**
 * sign a user operation with the requestId signature
 * @param signAddress signer address
 * @param signature the signature of the requestId
 * @returns
 */
export declare function signUserOpWithPersonalSign(signAddress: string, signature: string): string;
/**
 * sign a user operation with guardian signatures
 * @param requestId
 * @param signatures
 * @param walletAddress if web3 and walletAddress is not null, will check the signer on chain
 * @param web3 if web3 and walletAddress is not null, will check the signer on chain
 * @returns
 */
export declare function packGuardiansSignByRequestId(requestId: string, signatures: string[], walletAddress?: string | null, etherProvider?: ethers.providers.BaseProvider | null): Promise<string>;
export declare function payMasterSignHash(op: UserOperation): string;
