"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 16:08:23
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 21:32:15
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
exports.EIP4337Lib = void 0;
const utils_1 = require("ethers/lib/utils");
const address_1 = require("../defines/address");
const userOperation_1 = require("../entity/userOperation");
const guard_1 = require("../utils/guard");
const web3Helper_1 = require("../utils/web3Helper");
class EIP4337Lib {
    /**
     * calculate EIP-4337 wallet address
     * @param initCode the init code
     * @param jsonInterface the jsonInterface of the contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddressByCode(initCode, jsonInterface, initArgs, salt, create2Factory = address_1.Create2Factory) {
        guard_1.Guard.hex(initCode);
        const web3 = web3Helper_1.Web3Helper.new().web3;
        const initCodeWithArgs = new web3.eth.Contract(jsonInterface).deploy({
            data: initCode,
            arguments: initArgs
        }).encodeABI();
        const initCodeHash = (0, utils_1.keccak256)(initCodeWithArgs);
        return EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);
    }
    /**
     * calculate EIP-4337 wallet address
     * @param initCodeHash the init code after keccak256
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns the EIP-4337 wallet address
     */
    static calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory = address_1.Create2Factory) {
        guard_1.Guard.keccak256(initCodeHash);
        guard_1.Guard.uint(salt);
        guard_1.Guard.address(create2Factory);
        const saltBytes32 = (0, utils_1.hexZeroPad)((0, utils_1.hexlify)(salt), 32);
        return (0, utils_1.getCreate2Address)(create2Factory, saltBytes32, initCodeHash);
    }
    /**
     * update gas
     * @param entryPoint the entryPoint address
     * @param userOperation the userOperation to update
     * @param estimateGasFunc  the function to estimate gas
     */
    static estimateGas(entryPoint, userOperation, estimateGasFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            guard_1.Guard.address(entryPoint);
            userOperation.callGas = yield estimateGasFunc({
                from: entryPoint,
                to: userOperation.sender,
                data: userOperation.callData,
            });
        });
    }
    /**
     * Sign the userOperation with the given private key
     * @param userOperation the userOperation to sign
     * @param privateKey private key
     */
    static signUserOp(userOperation, privateKey) {
        // auto update the gas before signing
        // #TODO
        userOperation.signature = '<signature>';
    }
}
exports.EIP4337Lib = EIP4337Lib;
/**
 * User Operation
 */
EIP4337Lib.UserOperation = userOperation_1.UserOperation;
//# sourceMappingURL=EIP4337Lib.js.map