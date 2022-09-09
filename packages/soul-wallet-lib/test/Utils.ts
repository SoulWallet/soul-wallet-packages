/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-05 18:56:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-09 20:31:58
 */


import fs from 'fs';
import { SuggestedGasFees } from './entity/suggestedGasFees';
import Web3 from 'web3';
import axios from 'axios';
import { UserOperation } from '../src/entity/userOperation';
import { arrayify, defaultAbiCoder, hexlify, hexZeroPad, keccak256 } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { HttpPOSTResponse, signData } from './entity/PayMasterRPC';

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
    static async getGasPrice(chainid: number, type: 'low' | 'medium' | 'high' = 'high') {
        let suggestedGasFees = await Utils.getSuggestedGasFees(chainid);
        if (suggestedGasFees) {
            let f = suggestedGasFees[type];
            if (f && f.suggestedMaxPriorityFeePerGas && f.suggestedMaxFeePerGas && suggestedGasFees.estimatedBaseFee) {
                const MaxPriority = Math.ceil(parseFloat(f.suggestedMaxPriorityFeePerGas)).toString();
                const Max = Math.ceil(parseFloat(f.suggestedMaxFeePerGas)).toString();
                const Base = Math.ceil(parseFloat(suggestedGasFees.estimatedBaseFee)).toString();
                console.log(`Base:${Base} \t Max:${Max} \t MaxPriority:${MaxPriority}`);
                const web3 = new Web3();
                return {
                    Base: parseInt(web3.utils.toWei(Base, 'gwei')),
                    Max: parseInt(web3.utils.toWei(Max, 'gwei')),
                    MaxPriority: parseInt(web3.utils.toWei(MaxPriority, 'gwei'))
                }
            }
        }
        throw new Error('get GasPrice error');

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
        data: string | undefined, callback?: (txhash: string) => void) {
        const chainId = await web3.eth.net.getId();
        const gasPrice = await Utils.getGasPrice(chainId);
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const rawTx = {
            from: account.address,
            to: to,
            value: value,
            data: data,
            gas: web3.utils.toWei('1', 'ether'),
            maxPriorityFeePerGas: gasPrice.MaxPriority,
            maxFeePerGas: gasPrice.Max
        };

        let gas = (await web3.eth.estimateGas(rawTx)) * 5;
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

    static signOpUrl = 'http://paymasterapi-poc.soulwallets.me/sign';//'http://127.0.0.1/sign';//
    static sendOpUrl = 'http://paymasterapi-poc.soulwallets.me/send';//'http://127.0.0.1/send';// 

    static async signOp(op: UserOperation) {
        try {
            const data = await axios.post(Utils.signOpUrl, {
                method: 'sign',
                data: op,
                extra: {}
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resp = data.data as HttpPOSTResponse;
            if (resp.code === 0) {
                return resp.data as signData;
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }


    static async sendOp(op: UserOperation) {
        try {
            const data = await axios.post(Utils.sendOpUrl, {
                method: 'send',
                data: op,
                extra: {}
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resp = data.data as HttpPOSTResponse;
            if (resp.code === 0) {
                return resp.data as signData;
            }
        } catch (error) {
            console.log(error);
        }
        return null;
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

    static getRequestId(op: UserOperation, entryPointAddress: string, chainId: number): string {
        const userOpHash = keccak256(Utils.packUserOp(op, true))
        const enc = defaultAbiCoder.encode(
            ['bytes32', 'address', 'uint256'],
            [userOpHash, entryPointAddress, chainId])
        return keccak256(enc)
    }

}