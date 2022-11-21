import { UserOperation } from "../entity/userOperation";
import Web3 from "web3";
export declare class Token {
    static createOp(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAndData: string, maxFeePerGas: number, maxPriorityFeePerGas: number, callContract: string, encodeABI: string, value?: string): Promise<UserOperation | null>;
}
export declare class ERC20 {
    private static getContract;
    static approve(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _spender: string, _value: string): Promise<UserOperation | null>;
    static transferFrom(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _value: string): Promise<UserOperation | null>;
    static transfer(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _to: string, _value: string): Promise<UserOperation | null>;
}
export declare class ERC721 {
    private static getContract;
    static approve(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _spender: string, _tokenId: string): Promise<UserOperation | null>;
    static transferFrom(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _tokenId: string): Promise<UserOperation | null>;
    static transfer(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _to: string, _tokenId: string): Promise<UserOperation | null>;
    static safeTransferFrom(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _tokenId: string): Promise<UserOperation | null>;
    static setApprovalForAll(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _operator: string, _approved: boolean): Promise<UserOperation | null>;
}
export declare class ERC1155 {
    private static getContract;
    static safeTransferFrom(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _id: string, _value: string, _data: string): Promise<UserOperation | null>;
    static safeBatchTransferFrom(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _ids: string, _values: string, _data: string): Promise<UserOperation | null>;
    static setApprovalForAll(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _operator: string, _approved: boolean): Promise<UserOperation | null>;
}
export declare class ETH {
    static transfer(web3: Web3, walletAddress: string, nonce: number, entryPointAddress: string, paymasterAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, to: string, value: string): Promise<UserOperation | null>;
}
