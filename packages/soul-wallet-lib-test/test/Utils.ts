/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-05 18:56:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-23 17:59:53
 */


import fs from 'fs';
import { SuggestedGasFees } from './entity/suggestedGasFees';
import Web3 from 'web3';
import axios from 'axios';
import { arrayify, defaultAbiCoder, hexlify, hexZeroPad, keccak256 } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { UserOperation } from 'soul-wallet-lib/dist/entity/userOperation';
import { Ret_get, Ret_put } from './entity/bundler';

import { SocksProxyAgent } from 'socks-proxy-agent';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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

    /**
     * get suggested gas fees use codefi network api
     * @param chainid chain id
     * @returns SuggestedGasFees
     */
    private static async getSuggestedGasFees(chainid: number): Promise<SuggestedGasFees | null> {
        try {
            const apiData = await axios.get(`https://gas-api.metaswap.codefi.network/networks/${chainid}/suggestedGasFees`);
            const json = apiData.data as SuggestedGasFees;
            if (json && json.high && json.medium) {
                return json;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * get suggested gas fees from codefi network
     * @param chainid chain id
     * @param type gas level
     * @returns suggested gas fees
     */
    static async getGasPrice(web3: Web3, chainid: number, type: 'low' | 'medium' | 'high' = 'high') {
        try {
            let suggestedGasFees = await Utils.getSuggestedGasFees(chainid);
            if (suggestedGasFees) {
                let f = suggestedGasFees[type];
                if (f && f.suggestedMaxPriorityFeePerGas && f.suggestedMaxFeePerGas && suggestedGasFees.estimatedBaseFee) {
                    const MaxPriority = Math.ceil(parseFloat(f.suggestedMaxPriorityFeePerGas)).toString();
                    const Max = Math.ceil(parseFloat(f.suggestedMaxFeePerGas)).toString();
                    const Base = Math.ceil(parseFloat(suggestedGasFees.estimatedBaseFee)).toString();
                    console.log(`Base:${Base} \t Max:${Max} \t MaxPriority:${MaxPriority}`);

                    return {
                        Base: parseInt(web3.utils.toWei(Base, 'gwei')),
                        Max: parseInt(web3.utils.toWei(Max, 'gwei')),
                        MaxPriority: parseInt(web3.utils.toWei(MaxPriority, 'gwei'))
                    }
                }
            }
            throw new Error('get gas price failed');
        } catch (error) {
            console.log(error);
            // get gas price from blockchain
            // goerli-optimism https://gas-api.metaswap.codefi.network/networks/420/gasPrices
            // const block = await web3.eth.getBlock("latest");//pending
            // const baseFee = block.baseFeePerGas;
            // if (baseFee) {
            //     return {
            //         Base: parseInt(web3.utils.toWei(baseFee.toString(), 'gwei')),
            //         Max: undefined,
            //         MaxPriority: undefined
            //     }
            // } else {
            //     throw new Error('get gas price error');
            // }

            //legacy mode 
            return {
                Base: undefined,
                Max: parseInt(web3.utils.toWei('1', 'gwei')),
                MaxPriority: parseInt(web3.utils.toWei('1', 'gwei'))
            };

        }


    }

    /**
     * sign transaction and send transaction
     * @param web3 web3 instance
     * @param privateKey private key of from account
     * @param to to address
     * @param value value
     * @param data data
     * @returns null or transaction hash
     */
    static async signAndSendTransaction(web3: Web3,
        privateKey: string,
        to: string | undefined,
        value: string,
        data: string | undefined, callback?: (txhash: string) => void, gasLimitRatio: number = 1) {
        const chainId = await web3.eth.net.getId();
        const gasPrice = await Utils.getGasPrice(web3, chainId);
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);

        let rawTx: any;
        if (gasPrice.Max === gasPrice.MaxPriority) {
            // not support EIP1559
            rawTx = {
                from: account.address,
                to: to,
                value: value,
                data: data,
                //gas: web3.utils.toWei('0.1', 'ether'),
                gasPrice: gasPrice.Max
            };
        } else {
            rawTx = {
                from: account.address,
                to: to,
                value: value,
                data: data,
                //gas: web3.utils.toWei('0.1', 'ether'),
                maxPriorityFeePerGas: gasPrice.MaxPriority,
                maxFeePerGas: gasPrice.Max
            };
        }
        let gas = await web3.eth.estimateGas(rawTx);
        gas = gas * gasLimitRatio;
        rawTx.gas = web3.utils.toHex(web3.utils.toBN(gas)); // gas limit
        let signedTransactionData = await account.signTransaction(rawTx);
        if (signedTransactionData.rawTransaction && signedTransactionData.transactionHash) {
            callback && callback(signedTransactionData.transactionHash);
            await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction, (err: any, hash: string) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`tx:${hash} has been sent, please wait few secs to confirm`);

                }
            });
            while (true) {
                await Utils.sleep(1000 * 1);
                const receipt = await web3.eth.getTransactionReceipt(signedTransactionData.transactionHash);
                if (receipt) {
                    if (receipt.status === true) {
                        if (to) {
                            return signedTransactionData.transactionHash;
                        } else {
                            return receipt.logs[0].address;
                        }

                    } else {
                        throw new Error('transaction failed');
                    }
                }
            }
        }
        return null;
    }



    static getPayMasterSignHash(op: UserOperation): string {
        return keccak256(defaultAbiCoder.encode([
            'address', // sender
            'uint256', // nonce
            'bytes32', // initCode
            'bytes32', // callData
            'uint256', // callGas
            'uint', // verificationGas
            'uint', // preVerificationGas
            'uint256', // maxFeePerGas
            'uint256', // maxPriorityFeePerGas
            'address', // paymaster
        ], [
            op.sender,
            op.nonce,
            keccak256(op.initCode),
            keccak256(op.callData),
            op.callGas,
            op.verificationGas,
            op.preVerificationGas,
            op.maxFeePerGas,
            op.maxPriorityFeePerGas,
            op.paymaster,
        ]))
    }

    // static bundlerUrl = 'http://127.0.0.1/'; 
    static bundlerUrl = 'https://bundler-poc.soulwallets.me/'

    static async sendOp(op: UserOperation) {
        const proxyOptions = `socks5://127.0.0.1:1086`; // your sock5 host and port;
        const httpsAgent = new SocksProxyAgent(proxyOptions);
        try {
            // post or put 
            const result = await axios({
                httpsAgent,
                method: 'PUT',//post or put
                url: Utils.bundlerUrl,
                data: op,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return result.data as Ret_put;

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
            const proxyOptions = `socks5://127.0.0.1:1086`; // your sock5 host and port;
            const httpsAgent = new SocksProxyAgent(proxyOptions);

            const result = await axios({
                httpsAgent,
                method: 'GET',
                url: `${Utils.bundlerUrl}${requestId}`,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return result.data as Ret_get;
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


    static signPayMasterHash(message: string, privateKey: string): string {
        const msg1 = Buffer.concat([
            Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
            Buffer.from(arrayify(message))
        ])

        const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(privateKey)))
        // that's equivalent of:  await signer.signMessage(message);
        // (but without "async"
        const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s);
        return signedMessage1;
    }


    static encode(typevalues: Array<{ type: string, val: any }>, forSignature: boolean): string {
        const types = typevalues.map(typevalue => typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type)
        const values = typevalues.map((typevalue) => typevalue.type === 'bytes' && forSignature ? keccak256(typevalue.val) : typevalue.val)
        return defaultAbiCoder.encode(types, values)
    }

    static packUserOp(op: UserOperation, forSignature = true): string {
        if (forSignature) {
            // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
            const userOpType = {
                components: [
                    { type: 'address', name: 'sender' },
                    { type: 'uint256', name: 'nonce' },
                    { type: 'bytes', name: 'initCode' },
                    { type: 'bytes', name: 'callData' },
                    { type: 'uint256', name: 'callGas' },
                    { type: 'uint256', name: 'verificationGas' },
                    { type: 'uint256', name: 'preVerificationGas' },
                    { type: 'uint256', name: 'maxFeePerGas' },
                    { type: 'uint256', name: 'maxPriorityFeePerGas' },
                    { type: 'address', name: 'paymaster' },
                    { type: 'bytes', name: 'paymasterData' },
                    { type: 'bytes', name: 'signature' }
                ],
                name: 'userOp',
                type: 'tuple'
            }
            let encoded = defaultAbiCoder.encode([userOpType as any], [{ ...op, signature: '0x' }])
            // remove leading word (total length) and trailing word (zero-length signature)
            encoded = '0x' + encoded.slice(66, encoded.length - 64)
            return encoded
        }
        const typevalues = [
            { type: 'address', val: op.sender },
            { type: 'uint256', val: op.nonce },
            { type: 'bytes', val: op.initCode },
            { type: 'bytes', val: op.callData },
            { type: 'uint256', val: op.callGas },
            { type: 'uint256', val: op.verificationGas },
            { type: 'uint256', val: op.preVerificationGas },
            { type: 'uint256', val: op.maxFeePerGas },
            { type: 'uint256', val: op.maxPriorityFeePerGas },
            { type: 'address', val: op.paymaster },
            { type: 'bytes', val: op.paymasterData }
        ]
        if (!forSignature) {
            // for the purpose of calculating gas cost, also hash signature
            typevalues.push({ type: 'bytes', val: op.signature })
        }
        return Utils.encode(typevalues, forSignature)
    }

    // static getRequestId(op: UserOperation, entryPointAddress: string, chainId: number): string {
    //     const userOpHash = keccak256(Utils.packUserOp(op, true))
    //     const enc = defaultAbiCoder.encode(
    //         ['bytes32', 'address', 'uint256'],
    //         [userOpHash, entryPointAddress, chainId])
    //     return keccak256(enc)
    // }

}