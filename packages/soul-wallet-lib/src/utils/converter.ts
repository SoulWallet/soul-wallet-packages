/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-07 21:08:08
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-21 11:57:46
 */

import { UserOperation } from "../entity/userOperation";
import { execFromEntryPoint } from "../defines/ABI";
import Web3 from "web3";

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
        const web3 = new Web3();
        op.sender = transcation.from;
        op.preVerificationGas = 150000;
        op.nonce = nonce;
        op.paymasterAndData = paymasterAndData;
        op.maxFeePerGas = maxFeePerGas;
        op.maxPriorityFeePerGas = maxPriorityFeePerGas;
        op.callGasLimit = parseInt(transcation.gas, 16);
        op.callData = web3.eth.abi.encodeFunctionCall(
            execFromEntryPoint,
            [
                transcation.to,
                transcation.value,
                transcation.data
            ]
        );
        return op;
    }
}