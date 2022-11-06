/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 20:28:54
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-05 09:19:52
 */

import { UserOperation } from "../entity/userOperation";
import { SimpleWalletContract } from "../contracts/simpleWallet";
import Web3 from "web3";
import { packGuardiansSignByRequestId } from "../utils/userOp";


export class Guaridian {
    private static walletContract(web3: Web3, walletAddress: string) {
        return new web3.eth.Contract(SimpleWalletContract.ABI, walletAddress);
    }
    private static async _guardian(web3: Web3, walletAddress: string, nonce: number,
        entryPointAddress: string, paymasterAndData: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, callData: string) {

        walletAddress = web3.utils.toChecksumAddress(walletAddress);
        
        let userOperation: UserOperation = new UserOperation();
        userOperation.nonce = nonce;
        userOperation.sender = walletAddress;
        userOperation.paymasterAndData = paymasterAndData;
        userOperation.maxFeePerGas = maxFeePerGas;
        userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
        userOperation.callData = callData;
        let gasEstimated = await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
        if (!gasEstimated) {
            return null;
        }

        return userOperation;
    }

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
    static async grantGuardianRequest(web3: Web3, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {

        guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.grantGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }


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
    static async revokeGuardianRequest(web3: Web3, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.revokeGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }


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
    static async deleteGuardianRequest(web3: Web3, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.deleteGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }

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
    static async revokeGuardianConfirmation(web3: Web3, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.revokeGuardianConfirmation(guardianAddress).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }

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
    static async grantGuardianConfirmation(web3: Web3, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.grantGuardianConfirmation(guardianAddress).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }


    static async transferOwner(web3: Web3, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, newOwner: string) {
        newOwner = web3.utils.toChecksumAddress(newOwner);
        const calldata = Guaridian.walletContract(web3, walletAddress).methods.transferOwner(newOwner).encodeABI()

        return await this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }


 
    static packGuardiansSignByRequestId = packGuardiansSignByRequestId;




}
