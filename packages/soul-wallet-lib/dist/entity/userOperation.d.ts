/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol
 */
declare class UserOperation {
    private _sender;
    private _nonce;
    private _initCode;
    private _callData;
    private _callGas;
    private _verificationGas;
    private _preVerificationGas;
    private _maxFeePerGas;
    private _maxPriorityFeePerGas;
    private _paymaster;
    private _paymasterData;
    private _signature;
    constructor(sender: string, nonce: number, paymaster: string, callData?: string, initCode?: string);
    /**
     * the sender account of this request
     */
    get sender(): string;
    /**
     * the sender account of this request
     */
    set sender(value: string);
    /**
     * unique value the sender uses to verify it is not a replay.
     */
    get nonce(): number;
    /**
     * unique value the sender uses to verify it is not a replay.
     */
    set nonce(value: number);
    /**
     * if set, the account contract will be created by this constructor
     */
    get initCode(): string;
    /**
     * if set, the account contract will be created by this constructor
     */
    set initCode(value: string);
    /**
     * the method call to execute on this account.
     */
    get callData(): string;
    /**
     * the method call to execute on this account.
     */
    set callData(value: string);
    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    get callGas(): number;
    /**
     * gas used for validateUserOp and validatePaymasterUserOp
     */
    set callGas(value: number);
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    get verificationGas(): number;
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    set verificationGas(value: number);
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    get preVerificationGas(): number;
    /**
     * gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     */
    set preVerificationGas(value: number);
    /**
     * same as EIP-1559 gas parameter
     */
    get maxFeePerGas(): number;
    /**
     * same as EIP-1559 gas parameter
     */
    set maxFeePerGas(value: number);
    /**
     * same as EIP-1559 gas parameter
     */
    get maxPriorityFeePerGas(): number;
    /**
     * same as EIP-1559 gas parameter
     */
    set maxPriorityFeePerGas(value: number);
    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    get paymaster(): string;
    /**
     * if set, the paymaster will pay for the transaction instead of the sender
     */
    set paymaster(value: string);
    /**
     * extra data used by the paymaster for validation
     */
    get paymasterData(): string;
    /**
     * extra data used by the paymaster for validation
     */
    set paymasterData(value: string);
    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    get signature(): string;
    /**
     * sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    set signature(value: string);
}
export { UserOperation };
