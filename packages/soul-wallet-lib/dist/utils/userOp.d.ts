/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */
import { UserOperation } from '../entity/userOperation';
import Web3 from 'web3';
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
 * sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param signAddress user address
 * @param keyStoreSign user sign function
 * @returns signature
 */
export declare function signUserOpWithKeyStore(op: UserOperation, entryPointAddress: string, chainId: number, signAddress: string, keyStoreSign: (message: string) => Promise<string | null>): Promise<string>;
/**
 * guardian offline sign a user operation with the given keyStoreSign
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param signAddress
 * @param keyStoreSign
 * @returns
 */
export declare function guardianSignUserOpWithKeyStore(op: UserOperation, entryPointAddress: string, chainId: number, signAddress: string, keyStoreSign: (message: string) => Promise<string | null>): Promise<string | null>;
/**
 * guardian offline sign a requestId with the given keyStoreSign
 * @param requestId
 * @param signAddress
 * @param keyStoreSign
 * @returns
 */
export declare function guardianSignRequestIdWithKeyStore(requestId: string, signAddress: string, keyStoreSign: (message: string) => Promise<string | null>): Promise<string | null>;
/**
 * guardian offline sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param privateKey
 * @returns
 */
export declare function guardianSignUserOp(op: UserOperation, entryPointAddress: string, chainId: number, privateKey: string): string;
/**
 * guardian offline sign a user operation with the given private key
 * @param requestId
 * @param privateKey
 * @returns
 */
export declare function guardianSignRequestId(requestId: string, privateKey: string): string;
/**
 * sign a user operation with guardian signatures
 * @param requestId
 * @param signatures
 * @param walletAddress if web3 and walletAddress is not null, will check the signer on chain
 * @param web3 if web3 and walletAddress is not null, will check the signer on chain
 * @returns
 */
export declare function packGuardiansSignByRequestId(requestId: string, signatures: string[], walletAddress?: string | null, web3?: Web3 | null): Promise<string>;
export declare function payMasterSignHash(op: UserOperation): string;
