"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 20:28:54
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-23 16:08:29
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
const userOp_1 = require("../utils/userOp");
class Guaridian {
    static walletContract(web3, walletAddress) {
        return new web3.eth.Contract(simpleWallet_1.SimpleWalletContract.ABI, walletAddress);
    }
    static _guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, callData) {
        return __awaiter(this, void 0, void 0, function* () {
            walletAddress = web3.utils.toChecksumAddress(walletAddress);
            paymasterAddress = web3.utils.toChecksumAddress(paymasterAddress);
            let userOperation = new userOperation_1.UserOperation();
            userOperation.nonce = nonce;
            userOperation.sender = walletAddress;
            userOperation.paymaster = paymasterAddress;
            userOperation.maxFeePerGas = maxFeePerGas;
            userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
            userOperation.callData = callData;
            let gasEstimated = yield userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
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
    static grantGuardianRequest(web3, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.grantGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
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
    static revokeGuardianRequest(web3, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.revokeGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
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
    static deleteGuardianRequest(web3, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.deleteGuardianRequest(guardianAddress).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
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
    static revokeGuardianConfirmation(web3, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.revokeGuardianConfirmation(guardianAddress).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
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
    static grantGuardianConfirmation(web3, walletAddress, nonce, guardianAddress, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas) {
        return __awaiter(this, void 0, void 0, function* () {
            guardianAddress = web3.utils.toChecksumAddress(guardianAddress);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.grantGuardianConfirmation(guardianAddress).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
    }
    static transferOwner(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, newOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            newOwner = web3.utils.toChecksumAddress(newOwner);
            const calldata = Guaridian.walletContract(web3, walletAddress).methods.transferOwner(newOwner).encodeABI();
            return yield this._guardian(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, calldata);
        });
    }
}
exports.Guaridian = Guaridian;
Guaridian.guardianSignUserOpWithKeyStore = userOp_1.guardianSignUserOpWithKeyStore;
Guaridian.guardianSignRequestIdWithKeyStore = userOp_1.guardianSignRequestIdWithKeyStore;
Guaridian.guardianSignUserOp = userOp_1.guardianSignUserOp;
Guaridian.guardianSignRequestId = userOp_1.guardianSignRequestId;
Guaridian.packGuardiansSignByRequestId = userOp_1.packGuardiansSignByRequestId;
//# sourceMappingURL=Guardian.js.map