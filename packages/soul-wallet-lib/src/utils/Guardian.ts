/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 20:28:54
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 16:35:29
 */

import { UserOperation } from "../entity/userOperation";
import { SimpleWalletContract } from "../contracts/simpleWallet";
import { ethers } from "ethers";
import { packGuardiansSignByRequestId } from "../utils/userOp";


export class Guaridian {
    private static walletContract(etherProvider: ethers.providers.BaseProvider, walletAddress: string) {
        return new ethers.Contract(walletAddress, SimpleWalletContract.ABI, etherProvider);
    }
    private static async _guardian(etherProvider: ethers.providers.BaseProvider, walletAddress: string, nonce: number,
        entryPointAddress: string, paymasterAndData: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, callData: string) {

        walletAddress = ethers.utils.getAddress(walletAddress);
        let userOperation: UserOperation = new UserOperation();
        userOperation.nonce = nonce;
        userOperation.sender = walletAddress;
        userOperation.paymasterAndData = paymasterAndData;
        userOperation.maxFeePerGas = maxFeePerGas;
        userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
        userOperation.callData = callData;
        let gasEstimated = await userOperation.estimateGas(entryPointAddress, etherProvider);
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
    static async grantGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {


        guardianAddress = ethers.utils.getAddress(guardianAddress);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).grantGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
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
    static async revokeGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = ethers.utils.getAddress(guardianAddress);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).revokeGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
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
    static async deleteGuardianRequest(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = ethers.utils.getAddress(guardianAddress);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).deleteGuardianRequest(guardianAddress).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
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
    static async revokeGuardianConfirmation(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = ethers.utils.getAddress(guardianAddress);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).revokeGuardianConfirmation(guardianAddress).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
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
    static async grantGuardianConfirmation(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, guardianAddress: string, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number) {
        guardianAddress = ethers.utils.getAddress(guardianAddress);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).grantGuardianConfirmation(guardianAddress).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }


    static async transferOwner(etherProvider: ethers.providers.BaseProvider, walletAddress: string,
        nonce: number, entryPointAddress: string, paymasterAddress: string,
        maxFeePerGas: number, maxPriorityFeePerGas: number, newOwner: string) {
        newOwner = ethers.utils.getAddress(newOwner);
        const calldata = Guaridian.walletContract(etherProvider, walletAddress).transferOwner(newOwner).encodeABI()

        return await this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress,
            maxFeePerGas, maxPriorityFeePerGas, calldata);
    }



    static packGuardiansSignByRequestId = packGuardiansSignByRequestId;




}
