/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-05 18:56:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-22 10:56:21
 */


import fs from 'fs';
import Web3 from 'web3';
import axios from 'axios';
import config from './config';
import { hexlify, hexZeroPad} from 'ethers/lib/utils'
import { UserOperation } from 'soul-wallet-lib/dist/entity/userOperation';
import { Ret_get, Ret_put } from '../entity/bundler';

export class Utils {


    /**
     * sleep ms
     * @param {number} time ms
     */
    static sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        })
    }


    static numberToBytes32Hex(number: number): string {
        return hexZeroPad(hexlify(number), 32);
    }

    // static bundlerUrl = 'http://127.0.0.1/'; 
    // add /
    static bundlerUrl = `${config.bundlerUrl}/`;

    static async sendOp(op: UserOperation) {
        try {
            // post or put
            const data = await axios.post(Utils.bundlerUrl, op, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resp = data.data as Ret_put;
            return resp;
        } catch (error) {
            console.log(error);
        }
        return null;
    }
    static async getOpStateByUserOperation(op: UserOperation, entryPointAddress: string, chainId: number) {
        return Utils.getOpStateByReqeustId(op.getRequestId(entryPointAddress, chainId));
    }
    static async getOpStateByReqeustId(requestId: string) {
        try {
            const data = await axios.get(`${Utils.bundlerUrl}${requestId}`);
            const resp = data.data as Ret_get;
            return resp;
        } catch (error) {
            console.log(error);
        }
        return null;
    }


    static async sendOPWait(web3: Web3, op: UserOperation, entryPointAddress: string, chainId: number) {
        let ret: Ret_put | null = null;
        try {
            ret = await Utils.sendOp(op);
        } catch (e) {
            console.log(e);
        }
        if (!ret) {
            throw new Error('sendOp failed');
        }
        if (ret.code === 0) {
            console.log(`activateOp success`);
            console.log('wait for 60s to wait for the transaction ');
            for (let index = 0; index < 60; index++) {
                await Utils.sleep(1000);
                let ret: Ret_get | null = null;
                try {
                    ret = await Utils.getOpStateByUserOperation(op, entryPointAddress, chainId);
                } catch (error) {
                    console.log(error);
                }

                if (!ret) {
                    throw new Error('getOpStateByUserOperation failed');
                }
                if (ret.code === 0) {
                    console.log(`pending...`);
                } else if (ret.code === 1) {
                    console.log(`replaced with request id:${ret.requestId}`);
                    break;
                } else if (ret.code === 2) {
                    console.log(`processing...`);
                } else if (ret.code === 3) {
                    console.log(`success,tx:${ret.txHash}`);
                    // check tx status
                    for (let index = 0; index < 60; index++) {
                        await Utils.sleep(1000);
                        const receipt = await web3.eth.getTransactionReceipt(ret.txHash);
                        if (receipt) {
                            if (receipt.status === true) {
                                console.log(`tx:${ret.txHash} has been confirmed`);
                                return ret.txHash;
                                break;
                            } else {
                                throw new Error('transaction failed');
                            }
                        }
                    }
                    break;
                } else if (ret.code === 4) {
                    console.log(`failed`);
                    console.log(ret);
                    break;
                } else if (ret.code === 5) {
                    console.log(`notfound`);
                    break;
                }
            }
        } else {
            console.log(ret);
            throw new Error('activateOp failed');
        }
    }

}