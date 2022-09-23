"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-07-25 10:53:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-23 16:04:06
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperation = void 0;
const guard_1 = require("../utils/guard");
const userOp_1 = require("../utils/userOp");
/**
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/UserOperation.sol
 */
class UserOperation {
    constructor() {
        this.sender = '';
        this.nonce = 0;
        this.initCode = '0x';
        this.callData = '0x';
        this.callGas = 0;
        this.verificationGas = 0;
        this.preVerificationGas = 21000;
        this.maxFeePerGas = 0;
        this.maxPriorityFeePerGas = 0;
        this.paymaster = '0x';
        this.paymasterData = '0x';
        this.signature = '0x';
    }
    clone() {
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
    toTuple() {
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
    estimateGas(entryPointAddress, estimateGasFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.verificationGas = 150000;
                if (this.initCode.length > 0) {
                    this.verificationGas += (3200 + 200 * this.initCode.length);
                }
                this.callGas = yield estimateGasFunc({
                    from: entryPointAddress,
                    to: this.sender,
                    data: this.callData
                });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    /**
     * get the paymaster sign hash
     * @returns
     */
    payMasterSignHash() {
        return (0, userOp_1.payMasterSignHash)(this);
    }
    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    sign(entryPoint, chainId, privateKey) {
        guard_1.Guard.uint(chainId);
        guard_1.Guard.address(entryPoint);
        this.signature = (0, userOp_1.signUserOp)(this, entryPoint, chainId, privateKey);
    }
    /**
     * sign the user operation
     * @param entryPoint the entry point address
     * @param chainId the chain id
     * @param privateKey the private key
     */
    keystoreSign(entryPoint, chainId, signAddress, keyStoreSign) {
        return __awaiter(this, void 0, void 0, function* () {
            guard_1.Guard.uint(chainId);
            guard_1.Guard.address(entryPoint);
            this.signature = yield (0, userOp_1.signUserOpWithKeyStore)(this, entryPoint, chainId, signAddress, keyStoreSign);
            return this.signature !== null;
        });
    }
    /**
     * get the request id (userOp hash)
     * @param entryPointAddress the entry point address
     * @param chainId the chain id
     * @returns hex string
     */
    getRequestId(entryPointAddress, chainId) {
        return (0, userOp_1.getRequestId)(this, entryPointAddress, chainId);
    }
}
exports.UserOperation = UserOperation;
//# sourceMappingURL=userOperation.js.map