/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-21 21:24:32
 */

import Web3 from 'web3';
import { Guard } from '../utils/guard';
import { signUserOp, payMasterSignHash, signUserOpWithKeyStore } from '../utils/userOp';
import { TransactionInfo } from './transactionInfo';

/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol    
 */

class UserOperation {

    public sender: string = '';
    public nonce: number = 0;
    public initCode: string = '0x';
    public callData: string = '0x';
    public callGas: number = 0;
    public verificationGas: number = 0;
    public preVerificationGas: number = 21000;
    public maxFeePerGas: number = 0;
    public maxPriorityFeePerGas: number = 0;
    public paymaster: string = '0x';
    public paymasterData: string = '0x';
    public signature: string = '0x';

    public clone(): UserOperation {
        const clone = new UserOperation();
        clone.sender = this.sender;
        clone.nonce = this.nonce;
        clone.initCode = this.initCode;
        clone.callData = this.callData;
        clone.callGas = this.callGas;
        clone.verificationGas = this.verificationGas;
        clone.preVerificationGas = this.preVerificationGas;
        clone.maxFeePerGas = this.maxFeePerGas;
        clone.maxPriorityFeePerGas = this.maxPriorityFeePerGas;
        clone.paymaster = this.paymaster;
        clone.paymasterData = this.paymasterData;
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
        return `["${this.sender.toLocaleLowerCase()}","${this.nonce}","${this.initCode}","${this.callData}","${this.callGas}","${this.verificationGas}","${this.preVerificationGas}","${this.maxFeePerGas}","${this.maxPriorityFeePerGas}","${this.paymaster.toLocaleLowerCase()}","${this.paymasterData}","${this.signature}"]`;
    }

    /**
     * estimate the gas
     * @param entryPointAddress the entry point address
     * @param estimateGasFunc the estimate gas function
     * @returns false if failed
     */
    public async estimateGas(entryPointAddress: string, estimateGasFunc: (txInfo: TransactionInfo) => Promise<number>) {
        try {
            this.verificationGas = 100000;
            if (this.initCode.length > 0) {
                this.verificationGas += (3200 + 200 * this.initCode.length);
            }
            this.callGas = await estimateGasFunc({
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
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    public async keystoreSign(
        entryPoint: string,
        chainId: number, signAddress: string,
        keyStoreSign: (message: string) => Promise<string | null>): Promise<boolean> {
        Guard.uint(chainId);
        Guard.address(entryPoint);
        this.signature = await signUserOpWithKeyStore(this, entryPoint, chainId, signAddress, keyStoreSign);
        return this.signature !== null;
    }
}



export { UserOperation };