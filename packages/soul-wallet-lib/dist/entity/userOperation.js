"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 20:57:52
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperation = void 0;
const guard_1 = require("../utils/guard");
/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol
 */
class UserOperation {
    constructor(sender, nonce, paymaster, callData = '0x', initCode = '0x') {
        this._sender = '';
        this._nonce = 0;
        this._initCode = '0x';
        this._callData = '0x';
        this._callGas = 0;
        this._verificationGas = 0;
        this._preVerificationGas = 21000;
        this._maxFeePerGas = 0;
        this._maxPriorityFeePerGas = 0;
        this._paymaster = '0x';
        this._paymasterData = '0x';
        this._signature = '0x';
        this.sender = sender;
        this.nonce = nonce;
        this.initCode = initCode;
        this.callData = callData;
        this.paymaster = paymaster;
    }
    /**
     * the sender account of this request
     */
    get sender() {
        return this._sender;
    }
    /**
     * the sender account of this request
     */
    set sender(value) {
        guard_1.Guard.address(value);
        this._sender = value;
    }
    /**
     * unique value the sender uses to verify it is not a replay.
     */
    get nonce() {
        return this._nonce;
    }
    /**
     * unique value the sender uses to verify it is not a replay.
     */
    set nonce(value) {
        guard_1.Guard.uint(value);
        this._nonce = value;
    }
    /**
     * if set, the account contract will be created by this constructor
     */
    get initCode() {
        return this._initCode;
    }
    /**
     * if set, the account contract will be created by this constructor
     */
    set initCode(value) {
        guard_1.Guard.hex(value);
        this._initCode = value;
    }
    /**
     * the method call to execute on this account.
     */
    get callData() {
        return this._callData;
    }
    /**
     * the method call to execute on this account.
     */
    set callData(value) {
        guard_1.Guard.hex(value);
        this._callData = value;
    }
    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    get callGas() {
        return this._callGas;
    }
    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    set callGas(value) {
        guard_1.Guard.uint(value);
        this._callGas = value;
    }
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    get verificationGas() {
        return this._verificationGas;
    }
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    set verificationGas(value) {
        guard_1.Guard.uint(value);
        this._verificationGas = value;
    }
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    get preVerificationGas() {
        return this._preVerificationGas;
    }
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    set preVerificationGas(value) {
        guard_1.Guard.uint(value);
        this._preVerificationGas = value;
    }
    /**
     * same as EIP-1559 gas parameter
     */
    get maxFeePerGas() {
        return this._maxFeePerGas;
    }
    /**
     * same as EIP-1559 gas parameter
     */
    set maxFeePerGas(value) {
        guard_1.Guard.uint(value);
        this._maxFeePerGas = value;
    }
    /**
     * same as EIP-1559 gas parameter
     */
    get maxPriorityFeePerGas() {
        return this._maxPriorityFeePerGas;
    }
    /**
     * same as EIP-1559 gas parameter
     */
    set maxPriorityFeePerGas(value) {
        guard_1.Guard.uint(value);
        this._maxPriorityFeePerGas = value;
    }
    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    get paymaster() {
        return this._paymaster;
    }
    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    set paymaster(value) {
        guard_1.Guard.address(value);
        this._paymaster = value;
    }
    /**
     * extra data used by the paymaster for validation
     */
    get paymasterData() {
        return this._paymasterData;
    }
    /**
     * extra data used by the paymaster for validation
     */
    set paymasterData(value) {
        guard_1.Guard.hex(value);
        this._paymasterData = value;
    }
    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    get signature() {
        return this._signature;
    }
    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    set signature(value) {
        guard_1.Guard.hex(value);
        this._signature = value;
    }
}
exports.UserOperation = UserOperation;
//# sourceMappingURL=userOperation.js.map