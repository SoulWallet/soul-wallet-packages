/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */
import { UserOperation } from '../entity/userOperation';
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
export declare function payMasterSignHash(op: UserOperation): string;
