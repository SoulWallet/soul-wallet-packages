/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:39:57
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 21:27:41
 */

import Web3 from "web3";

export class Web3Helper {
    private static instance: Web3Helper;
    private _web3: Web3;
    private constructor() {
        this._web3 = new Web3();
    }

    public static new() {
        if (!Web3Helper.instance) {
            Web3Helper.instance = new Web3Helper();
        }
        return Web3Helper.instance;
    }

    public get web3(): Web3 {
        return this._web3;
    }
}