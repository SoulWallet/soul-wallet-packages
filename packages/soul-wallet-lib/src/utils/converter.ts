/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-07 21:08:08
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-22 22:38:52
 */

import { UserOperation } from "../entity/userOperation";
import { execFromEntryPoint } from "../defines/ABI";
import { ethers } from "ethers";

export interface ITransaction {
    data: string;
    from: string;
    gas: string;
    to: string;
    value: string;
}

export class Converter {

    public static fromTransaction(
        transcation: ITransaction,
        nonce: number = 0,
        maxFeePerGas: number = 0,
        maxPriorityFeePerGas: number = 0,
        paymasterAndData: string = "0x"
    ): UserOperation {
        const op = new UserOperation();
        op.sender = transcation.from;
        op.preVerificationGas = 150000;
        op.nonce = nonce;
        op.paymasterAndData = paymasterAndData;
        op.maxFeePerGas = maxFeePerGas;
        op.maxPriorityFeePerGas = maxPriorityFeePerGas;
        op.callGasLimit = parseInt(transcation.gas, 16);

        op.callData = new ethers.utils.Interface(execFromEntryPoint)
            .encodeFunctionData("execFromEntryPoint",
                [transcation.to, transcation.value, transcation.data]);

        return op;
    }
}