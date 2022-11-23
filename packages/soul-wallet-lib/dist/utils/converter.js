"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-07 21:08:08
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-22 22:38:52
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const userOperation_1 = require("../entity/userOperation");
const ABI_1 = require("../defines/ABI");
const ethers_1 = require("ethers");
class Converter {
    static fromTransaction(transcation, nonce = 0, maxFeePerGas = 0, maxPriorityFeePerGas = 0, paymasterAndData = "0x") {
        const op = new userOperation_1.UserOperation();
        op.sender = transcation.from;
        op.preVerificationGas = 150000;
        op.nonce = nonce;
        op.paymasterAndData = paymasterAndData;
        op.maxFeePerGas = maxFeePerGas;
        op.maxPriorityFeePerGas = maxPriorityFeePerGas;
        op.callGasLimit = parseInt(transcation.gas, 16);
        op.callData = new ethers_1.ethers.utils.Interface(ABI_1.execFromEntryPoint)
            .encodeFunctionData("execFromEntryPoint", [transcation.to, transcation.value, transcation.data]);
        return op;
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map