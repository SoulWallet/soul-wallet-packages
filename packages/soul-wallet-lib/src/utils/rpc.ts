/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-16 15:50:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 11:06:26
 */

import Web3 from "web3";
import { ethers } from "ethers";
import { EntryPointContract } from "../contracts/entryPoint";
import { UserOperation } from "../entity/userOperation";

export class RPC {
    static eth_sendUserOperation(op: UserOperation, entryPointAddress: string) {
        const op_str = JSON.stringify(op);
        return '{\
            "jsonrpc": "2.0",\
            "method": "eth_sendUserOperation",\
            "params": ['
            + op_str +
            ',"' + entryPointAddress +
            '"],\
            "id": 1\
        }';
    }

    static eth_supportedEntryPoints() {
        return '{\
            "jsonrpc": "2.0",\
            "id": 1,\
            "method": "eth_supportedEntryPoints",\
            "params": []\
          }';
    }




    /**
     * wait for the userOp to be mined
     * @param web3 web3 instance
     * @param entryPointAddress the entryPoint address
     * @param requestId the requestId
     * @param timeOut the time out, default:1000 * 60 * 10 ( 10 minutes)
     * @param fromBlock the fromBlock, default: latest - 5
     * @returns the userOp event array
     */
    static async waitUserOperationWeb3(
        web3: Web3,
        entryPointAddress: string,
        requestId: string,
        timeOut: number = 1000 * 60 * 10,
        fromBlock?: number
    ): Promise<EventData[]> {
        web3 = new Web3(web3.currentProvider);
        const interval = 1000 * 10;
        const startTime = Date.now();
        // get last block
        let _fromBlock = 0;
        if (fromBlock) {
            _fromBlock = fromBlock;
        } else {
            _fromBlock = await web3.eth.getBlockNumber() - 5;
        }
        const entryPoint_web3 = new web3.eth.Contract(EntryPointContract.ABI, entryPointAddress);
        while (true) {
            let pastEvent: EventData[] | Array<ethers.Event>;

            pastEvent = await entryPoint_web3.getPastEvents('UserOperationEvent',
                {
                    filter: {
                        requestId: requestId,
                    },
                    fromBlock: _fromBlock,
                    toBlock: 'latest'
                }
            );

            if (pastEvent && pastEvent.length > 0) {
                return pastEvent;
            }

            if (Date.now() - startTime > timeOut) {
                return [];
                //throw new Error('requestId timeout');
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }


    /**
     * wait for the userOp to be mined
     * @param provider ethers provider
     * @param entryPointAddress the entryPoint address
     * @param requestId the requestId
     * @param timeOut the time out, default:1000 * 60 * 10 ( 10 minutes)
     * @param fromBlock the fromBlock, default: latest - 5
     * @returns the userOp event array
     */
    static async waitUserOperationEther(
        provider: ethers.providers.BaseProvider,
        entryPointAddress: string,
        requestId: string,
        timeOut: number = 1000 * 60 * 10,
        fromBlock?: number
    ): Promise<EventData[] | Array<ethers.Event>> {
        const interval = 1000 * 10;
        const startTime = Date.now();
        // get last block
        let _fromBlock = 0;
        if (fromBlock) {
            _fromBlock = fromBlock;
        } else {

            _fromBlock = await provider.getBlockNumber() - 5;
        }
        const entryPoint_ether = new ethers.Contract(entryPointAddress, EntryPointContract.ABI as any, provider);
        while (true) {
            let pastEvent: EventData[] | Array<ethers.Event>;
            pastEvent = await entryPoint_ether.queryFilter('UserOperationEvent', _fromBlock);
            if (pastEvent && pastEvent.length > 0) {
                return pastEvent;
            }

            if (Date.now() - startTime > timeOut) {
                return [];
                //throw new Error('requestId timeout');
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }


}

export interface EventData {
    returnValues: {
        [key: string]: any;
    };
    raw: {
        data: string;
        topics: string[];
    };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
}