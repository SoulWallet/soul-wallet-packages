/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-18 15:27:59
 */

import { Guard } from '../utils/guard';
import { signUserOp, payMasterSignHash, getRequestId, signUserOpWithPersonalSign } from '../utils/userOp';
import { TransactionInfo } from './transactionInfo';

/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol    
 */

class UserOperation {

    public sender: string = '';
    public nonce: number = 0;
    public initCode: string = '0x';
    public callData: string = '0x';
    public callGasLimit: number = 0;
    public verificationGasLimit: number = 0;
    public preVerificationGas: number = 62000;
    public maxFeePerGas: number = 0;
    public maxPriorityFeePerGas: number = 0;
    public paymasterAndData: string = '0x';
    public signature: string = '0x';

    public clone(): UserOperation {
        const clone = new UserOperation();
        clone.sender = this.sender;
        clone.nonce = this.nonce;
        clone.initCode = this.initCode;
        clone.callData = this.callData;
        clone.callGasLimit = this.callGasLimit;
        clone.verificationGasLimit = this.verificationGasLimit;
        clone.preVerificationGas = this.preVerificationGas;
        clone.maxFeePerGas = this.maxFeePerGas;
        clone.maxPriorityFeePerGas = this.maxPriorityFeePerGas;
        clone.paymasterAndData = this.paymasterAndData;
        clone.signature = this.signature;
        return clone;
    }

    public toTuple(): string {
        /* 
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint callGas;
        uint verificationGas;
        uint preVerificationGas;
        uint maxFeePerGas;
        uint maxPriorityFeePerGas;
        address paymaster;
        bytes paymasterData;
        bytes signature;
        */
        return `["${this.sender.toLocaleLowerCase()}","${this.nonce}","${this.initCode}","${this.callData}","${this.callGasLimit}","${this.verificationGasLimit}","${this.preVerificationGas}","${this.maxFeePerGas}","${this.maxPriorityFeePerGas}","${this.paymasterAndData}","${this.signature}"]`;
    }

    /**
     * estimate the gas
     * @param entryPointAddress the entry point address
     * @param estimateGasFunc the estimate gas function
     * @returns false if failed
     */
    public async estimateGas(entryPointAddress: string, estimateGasFunc: (txInfo: TransactionInfo) => Promise<number>) {
        try {
            this.verificationGasLimit = 150000;
            if (this.initCode.length > 0) {
                this.verificationGasLimit += (3200 + 200 * this.initCode.length);
            }
            this.callGasLimit = await estimateGasFunc({
                from: entryPointAddress,
                to: this.sender,
                data: this.callData
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    /**
     * get the paymaster sign hash
     * @returns 
     */
    public payMasterSignHash(): string {
        return payMasterSignHash(this);
    }

    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    public sign(
        entryPoint: string,
        chainId: number,
        privateKey: string): void {
        Guard.uint(chainId);
        Guard.address(entryPoint);
        this.signature = signUserOp(this, entryPoint, chainId, privateKey);
    }


    /**
     * sign the user operation with personal sign
     * @param signAddress the sign address
     * @param signature the signature of the requestId
     */
    public signWithSignature(signAddress: string, signature: string) {
        this.signature = signUserOpWithPersonalSign(signAddress, signature);
    }


    /**
     * get the request id (userOp hash)
     * @param entryPointAddress the entry point address
     * @param chainId the chain id
     * @returns hex string
     */
    public getRequestId(entryPointAddress: string, chainId: number): string {
        return getRequestId(this, entryPointAddress, chainId);
    }

}



export { UserOperation };