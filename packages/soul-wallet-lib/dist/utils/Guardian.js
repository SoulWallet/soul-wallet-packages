"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 20:28:54
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 16:35:29
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
exports.Guaridian = void 0;
const userOperation_1 = require("../entity/userOperation");
const simpleWallet_1 = require("../contracts/simpleWallet");
const ethers_1 = require("ethers");
const userOp_1 = require("../utils/userOp");
class Guaridian {
    static walletContract(etherProvider, walletAddress) {
        return new ethers_1.ethers.Contract(walletAddress, simpleWallet_1.SimpleWalletContract.ABI, etherProvider);
    }
    static _guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAndData, maxFeePerGas, maxPriorityFeePerGas, callData) {
        return __awaiter(this, void 0, void 0, function* () {
            walletAddress = ethers_1.ethers.utils.getAddress(walletAddress);
            let userOperation = new userOperation_1.UserOperation();
            userOperation.nonce = nonce;
            userOperation.sender = walletAddress;
            userOperation.paymasterAndData = paymasterAndData;
            userOperation.maxFeePerGas = maxFeePerGas;
            userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
            userOperation.callData = callData;
            let gasEstimated = yield userOperation.estimateGas(entryPointAddress, etherProvider);
            if (!gasEstimated) {
                return null;
            }
            return userOperation;
        });
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
    static grantGuardianRequest(etherProvider, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = ethers_1.ethers.utils.getAddress(guardianAddress);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).grantGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
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
    static revokeGuardianRequest(etherProvider, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = ethers_1.ethers.utils.getAddress(guardianAddress);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).revokeGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
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
    static deleteGuardianRequest(etherProvider, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = ethers_1.ethers.utils.getAddress(guardianAddress);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).deleteGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
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
    static revokeGuardianConfirmation(etherProvider, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = ethers_1.ethers.utils.getAddress(guardianAddress);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).revokeGuardianConfirmation(guardianAddress).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
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
    static grantGuardianConfirmation(etherProvider, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = ethers_1.ethers.utils.getAddress(guardianAddress);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).grantGuardianConfirmation(guardianAddress).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
    }
    static transferOwner(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, newOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            newOwner = ethers_1.ethers.utils.getAddress(newOwner);
            const calldata = Guaridian.walletContract(etherProvider, walletAddress).transferOwner(newOwner).encodeABI();
            return yield this._guardian(etherProvider, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
    }
}
exports.Guaridian = Guaridian;
Guaridian.packGuardiansSignByRequestId = userOp_1.packGuardiansSignByRequestId;
//# sourceMappingURL=Guardian.js.map