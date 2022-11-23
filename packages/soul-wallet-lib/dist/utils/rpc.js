"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-16 15:50:52
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 11:06:26
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC = void 0;
const web3_1 = __importDefault(require("web3"));
const ethers_1 = require("ethers");
const entryPoint_1 = require("../contracts/entryPoint");
class RPC {
    static eth_sendUserOperation(op, entryPointAddress) {
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
    static waitUserOperationWeb3(web3, entryPointAddress, requestId, timeOut = 1000 * 60 * 10, fromBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            web3 = new web3_1.default(web3.currentProvider);
            const interval = 1000 * 10;
            const startTime = Date.now();
            // get last block
            let _fromBlock = 0;
            if (fromBlock) {
                _fromBlock = fromBlock;
            }
            else {
                _fromBlock = (yield web3.eth.getBlockNumber()) - 5;
            }
            const entryPoint_web3 = new web3.eth.Contract(entryPoint_1.EntryPointContract.ABI, entryPointAddress);
            while (true) {
                let pastEvent;
                pastEvent = yield entryPoint_web3.getPastEvents('UserOperationEvent', {
                    filter: {
                        requestId: requestId,
                    },
                    fromBlock: _fromBlock,
                    toBlock: 'latest'
                });
                if (pastEvent && pastEvent.length > 0) {
                    return pastEvent;
                }
                if (Date.now() - startTime > timeOut) {
                    return [];
                    //throw new Error('requestId timeout');
                }
                yield new Promise((resolve) => setTimeout(resolve, interval));
            }
        });
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
    static waitUserOperationEther(provider, entryPointAddress, requestId, timeOut = 1000 * 60 * 10, fromBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const interval = 1000 * 10;
            const startTime = Date.now();
            // get last block
            let _fromBlock = 0;
            if (fromBlock) {
                _fromBlock = fromBlock;
            }
            else {
                _fromBlock = (yield provider.getBlockNumber()) - 5;
            }
            const entryPoint_ether = new ethers_1.ethers.Contract(entryPointAddress, entryPoint_1.EntryPointContract.ABI, provider);
            while (true) {
                let pastEvent;
                pastEvent = yield entryPoint_ether.queryFilter('UserOperationEvent', _fromBlock);
                if (pastEvent && pastEvent.length > 0) {
                    return pastEvent;
                }
                if (Date.now() - startTime > timeOut) {
                    return [];
                    //throw new Error('requestId timeout');
                }
                yield new Promise((resolve) => setTimeout(resolve, interval));
            }
        });
    }
}
exports.RPC = RPC;
//# sourceMappingURL=rpc.js.map