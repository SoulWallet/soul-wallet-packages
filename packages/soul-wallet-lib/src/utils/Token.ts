/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 21:45:49
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-05 09:20:15
 */
import { UserOperation } from "../entity/userOperation";
import { SimpleWalletContract } from "../contracts/simpleWallet";
import Web3 from "web3";
import { execFromEntryPoint, ERC1155 as erc1155, ERC20 as erc20, ERC721 as erc721 } from "../defines/ABI";

export class Token {

    static async createOp(web3: Web3, walletAddress: string, nonce: number,
        entryPointAddress: string, paymasterAndData: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, callContract: string, encodeABI: string, value: string = '0') {

        walletAddress = web3.utils.toChecksumAddress(walletAddress);

        let userOperation: UserOperation = new UserOperation();
        userOperation.nonce = nonce;
        userOperation.sender = walletAddress;
        userOperation.paymasterAndData = paymasterAndData;
        userOperation.maxFeePerGas = maxFeePerGas;
        userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
        userOperation.callData = web3.eth.abi.encodeFunctionCall(
            execFromEntryPoint,
            [
                callContract,
                web3.utils.toHex(value),
                encodeABI
            ]
        );
        let gasEstimated = await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
        if (!gasEstimated) {
            return null;
        }

        return userOperation;
    }
}
export class ERC20 {
    private static getContract(web3: Web3, contractAddress: string) {
        return new web3.eth.Contract(erc20, contractAddress);
    }
    static async approve(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _spender: string, _value: string) {
        let contract = ERC20.getContract(web3, token);
        let encodeABI = contract.methods.approve(_spender, _value).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async transferFrom(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _value: string) {
        let contract = ERC20.getContract(web3, token);
        let encodeABI = contract.methods.transferFrom(_from, _to, _value).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async transfer(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _to: string, _value: string) {
        let contract = ERC20.getContract(web3, token);
        let encodeABI = contract.methods.transfer(_to, _value).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }
}

export class ERC721 {
    private static getContract(web3: Web3, contractAddress: string) {
        return new web3.eth.Contract(erc721, contractAddress);
    }
    static async approve(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _spender: string, _tokenId: string) {
        let contract = ERC721.getContract(web3, token);
        let encodeABI = contract.methods.approve(_spender, _tokenId).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async transferFrom(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _tokenId: string) {
        let contract = ERC721.getContract(web3, token);
        let encodeABI = contract.methods.transferFrom(_from, _to, _tokenId).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async transfer(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _to: string, _tokenId: string) {
        let contract = ERC721.getContract(web3, token);
        let encodeABI = contract.methods.transfer(_to, _tokenId).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async safeTransferFrom(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _tokenId: string) {
        let contract = ERC721.getContract(web3, token);
        let encodeABI = contract.methods.safeTransferFrom(_from, _to, _tokenId).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async setApprovalForAll(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _operator: string, _approved: boolean) {
        let contract = ERC721.getContract(web3, token);
        let encodeABI = contract.methods.setApprovalForAll(_operator, _approved).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }


}

export class ERC1155 {
    private static getContract(web3: Web3, contractAddress: string) {
        return new web3.eth.Contract(erc1155, contractAddress);
    }
    static async safeTransferFrom(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _id: string, _value: string, _data: string) {
        let contract = ERC1155.getContract(web3, token);
        let encodeABI = contract.methods.safeTransferFrom(_from, _to, _id, _value, _data).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async safeBatchTransferFrom(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _from: string, _to: string, _ids: string, _values: string, _data: string) {
        let contract = ERC1155.getContract(web3, token);
        let encodeABI = contract.methods.safeBatchTransferFrom(_from, _to, _ids, _values, _data).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }

    static async setApprovalForAll(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, token: string, _operator: string, _approved: boolean) {
        let contract = ERC1155.getContract(web3, token);
        let encodeABI = contract.methods.setApprovalForAll(_operator, _approved).encodeABI();
        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
    }


}

export class ETH {
    static async transfer(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, to: string, value: string) {

        return await Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, to, '0x', value);
    }
}