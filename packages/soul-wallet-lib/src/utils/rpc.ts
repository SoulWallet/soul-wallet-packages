/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-16 15:50:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-22 22:44:55
 */
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
    static async waitUserOperation(
        etherProvider: ethers.providers.BaseProvider,
        entryPointAddress: string,
        requestId: string,
        timeOut: number = 1000 * 60 * 10,
        fromBlock?: number
    ): Promise<Array<ethers.Event>> {
        const interval = 1000 * 10;
        const startTime = Date.now();
        // get last block
        let _fromBlock = 0;
        if (fromBlock) {
            _fromBlock = fromBlock;
        } else {
            _fromBlock = await etherProvider.getBlockNumber() - 5;
        }
        const entryPoint = new ethers.Contract(entryPointAddress, EntryPointContract.ABI, etherProvider);
        while (true) {
            // get event
            //  event UserOperationEvent(bytes32 indexed requestId, address indexed sender, address indexed paymaster, uint256 nonce, uint256 actualGasCost, uint256 actualGasPrice, bool success);
           
            const pastEvent:Array<ethers.Event> = await entryPoint.queryFilter('UserOperationEvent', _fromBlock);
            // const postEvent = await entryPoint.getPastEvents('UserOperationEvent',
            //     {
            //         filter: {
            //             requestId: requestId,
            //         },
            //         fromBlock: _fromBlock,
            //         toBlock: 'latest'
            //     }
            // );
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