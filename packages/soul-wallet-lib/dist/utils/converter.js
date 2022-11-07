"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-07 21:08:08
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-07 21:44:03
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const userOperation_1 = require("../entity/userOperation");
const ABI_1 = require("../defines/ABI");
const web3_1 = __importDefault(require("web3"));
class Converter {
    static fromTransaction(transcation, nonce = 0, maxFeePerGas = 0, maxPriorityFeePerGas = 0, paymaster = "0x") {
        const op = new userOperation_1.UserOperation();
        const web3 = new web3_1.default();
        op.sender = transcation.from;
        op.verificationGas = 150000;
        op.nonce = nonce;
        op.paymaster = paymaster;
        op.maxFeePerGas = maxFeePerGas;
        op.maxPriorityFeePerGas = maxPriorityFeePerGas;
        op.callGas = parseInt(transcation.gas, 16);
        op.callData = web3.eth.abi.encodeFunctionCall(ABI_1.execFromEntryPoint, [
            transcation.to,
            transcation.value,
            transcation.data
        ]);
        return op;
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map