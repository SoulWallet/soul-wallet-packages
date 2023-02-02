/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-05 18:56:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-22 10:56:21
 */
import { ethers } from "ethers";
import ky from "ky";
import { WalletAbi, EntryPointAbi } from "./abi";
import config from "./config";
import { hexlify, hexZeroPad } from "ethers/lib/utils";
import { UserOperation } from "soul-wallet-lib/dist/entity/userOperation";

export interface ITransaction {
    data: string;
    from: string;
    gas: string;
    to: string;
    value: string;
}

const provider = new ethers.providers.JsonRpcProvider(config.provider);

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
        });
    }

    static numberToBytes32Hex(number: number): string {
        return hexZeroPad(hexlify(number), 32);
    }

    // add /
    static bundlerUrl = `${config.bundlerUrl}/`;

    static async sendOp(op: UserOperation) {
        try {
            // post or put
            return await ky.post(Utils.bundlerUrl, { json: op }).json();
        } catch (error) {
            console.log(error);
        }
        return null;
    }
    static async getOpStateByUserOperation(
        op: UserOperation,
        entryPointAddress: string,
        chainId: number,
        requestId: string,
    ) {
        return Utils.getOpStateByReqeustId(requestId);
    }
    static async getOpStateByReqeustId(requestId: string) {
        try {
            return await ky.get(`${Utils.bundlerUrl}${requestId}`).json();
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    static async sendOPWait(
        op: UserOperation,
        entryPointAddress: string,
        chainId: number,
        requestId: string,
    ) {
        let ret: any = null;
        try {
            ret = await Utils.sendOp(op);
        } catch (e) {
            console.log(e);
        }
        if (!ret) {
            throw new Error("sendOp failed");
        }
        if (ret.code === 0) {
            console.log(`activateOp success`);
            console.log("wait for 60s to wait for the transaction ");
            for (let index = 0; index < 60; index++) {
                await Utils.sleep(1000);
                let ret: any = null;
                try {
                    ret = await Utils.getOpStateByUserOperation(
                        op,
                        entryPointAddress,
                        chainId,
                        requestId,
                    );
                } catch (error) {
                    console.log(error);
                }

                if (!ret) {
                    throw new Error("getOpStateByUserOperation failed");
                }
                if (ret.code === 0) {
                    console.log(`pending...`);
                } else if (ret.code === 1) {
                    console.log(`replaced with request id:${ret.requestId}`);
                    break;
                } else if (ret.code === 2) {
                    console.log(`processing...`);
                } else if (ret.code === 3) {
                    console.log("success", ret);
                    // check tx status
                    for (let index = 0; index < 60; index++) {
                        await Utils.sleep(1000);
                        const receipt = await provider.getTransactionReceipt(
                            ret.txHash,
                        );
                        if (receipt) {
                            if (receipt.status === 1) {
                                console.log(
                                    `tx:${ret.txHash} has been confirmed`,
                                );
                                return ret;
                                break;
                            } else {
                                throw new Error("transaction failed");
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
            throw new Error("activateOp failed");
        }
    }
}
