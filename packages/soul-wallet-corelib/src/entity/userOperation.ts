/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 22:46:12
 */

import { Guard } from '../utils/guard';

/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol    
 */

class UserOperation {

    private _sender: string = '';
    private _nonce: number = 0;
    private _initCode: string = '0x';
    private _callData: string = '0x';
    private _callGas: number = 0;
    private _verificationGas: number = 0;
    private _preVerificationGas: number = 21000;
    private _maxFeePerGas: number = 0;
    private _maxPriorityFeePerGas: number = 0;
    private _paymaster: string = '0x';
    private _paymasterData: string = '0x';
    private _signature: string = '0x';

    constructor(
        sender: string,
        nonce: number,
        paymaster: string,
        callData: string = '0x',
        initCode: string = '0x'
    ) {
        this.sender = sender;
        this.nonce = nonce;
        this.initCode = initCode;
        this.callData = callData;
        this.paymaster = paymaster;
    }


    /**
     * the sender account of this request
     */
    public get sender(): string {
        return this._sender;
    }

    /**
     * the sender account of this request
     */
    public set sender(value: string) {
        Guard.address(value);
        this._sender = value;
    }

    /**
     * unique value the sender uses to verify it is not a replay.
     */
    public get nonce(): number {
        return this._nonce;
    }

    /**
     * unique value the sender uses to verify it is not a replay.
     */
    public set nonce(value: number) {
        Guard.uint(value);
        this._nonce = value;
    }

    /**
     * if set, the account contract will be created by this constructor
     */
    public get initCode(): string {
        return this._initCode;
    }

    /**
     * if set, the account contract will be created by this constructor
     */
    public set initCode(value: string) {
        Guard.hex(value);
        this._initCode = value;
    }

    /**
     * the method call to execute on this account.
     */
    public get callData(): string {
        return this._callData;
    }

    /**
     * the method call to execute on this account.
     */
    public set callData(value: string) {
        Guard.hex(value);
        this._callData = value;
    }

    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    public get callGas(): number {
        return this._callGas;
    }

    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    public set callGas(value: number) {
        Guard.positiveInteger(value);
        this._callGas = value;
    }

    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    public get verificationGas(): number {
        return this._verificationGas;
    }

    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    public set verificationGas(value: number) {
        Guard.positiveInteger(value);
        this._verificationGas = value;
    }

    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    public get preVerificationGas(): number {
        return this._preVerificationGas;
    }

    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    public set preVerificationGas(value: number) {
        Guard.positiveInteger(value);
        this._preVerificationGas = value;
    }

    /**
     * same as EIP-1559 gas parameter
     */
    public get maxFeePerGas(): number {
        return this._maxFeePerGas;
    }

    /**
     * same as EIP-1559 gas parameter
     */
    public set maxFeePerGas(value: number) {
        Guard.positiveInteger(value);
        this._maxFeePerGas = value;
    }

    /**
     * same as EIP-1559 gas parameter
     */
    public get maxPriorityFeePerGas(): number {
        return this._maxPriorityFeePerGas;
    }

    /**
     * same as EIP-1559 gas parameter
     */
    public set maxPriorityFeePerGas(value: number) {
        Guard.positiveInteger(value);
        this._maxPriorityFeePerGas = value;
    }

    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    public get paymaster(): string {
        return this._paymaster;
    }

    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    public set paymaster(value: string) {
        Guard.address(value);
        this._paymaster = value;
    }

    /**
     * extra data used by the paymaster for validation
     */
    public get paymasterData(): string {
        return this._paymasterData;
    }


    /**
     * extra data used by the paymaster for validation
     */
    public set paymasterData(value: string) {
        Guard.hex(value);
        this._paymasterData = value;
    }

    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    public get signature(): string {
        return this._signature;
    }


    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    public set signature(value: string) {
        Guard.hex(value);
        this._signature = value;
    }



}



export { UserOperation };