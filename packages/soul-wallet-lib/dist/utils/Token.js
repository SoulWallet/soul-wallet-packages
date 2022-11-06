"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETH = exports.ERC1155 = exports.ERC721 = exports.ERC20 = exports.Token = void 0;
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 21:45:49
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-05 09:20:15
 */
const userOperation_1 = require("../entity/userOperation");
const ABI_1 = require("../defines/ABI");
class Token {
    static createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAndData, maxFeePerGas, maxPriorityFeePerGas, callContract, encodeABI, value = '0') {
        return __awaiter(this, void 0, void 0, function* () {
            walletAddress = web3.utils.toChecksumAddress(walletAddress);
            let userOperation = new userOperation_1.UserOperation();
            userOperation.nonce = nonce;
            userOperation.sender = walletAddress;
            userOperation.paymasterAndData = paymasterAndData;
            userOperation.maxFeePerGas = maxFeePerGas;
            userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
            userOperation.callData = web3.eth.abi.encodeFunctionCall(ABI_1.execFromEntryPoint, [
                callContract,
                web3.utils.toHex(value),
                encodeABI
            ]);
            let gasEstimated = yield userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
            if (!gasEstimated) {
                return null;
            }
            return userOperation;
        });
    }
}
exports.Token = Token;
class ERC20 {
    static getContract(web3, contractAddress) {
        return new web3.eth.Contract(ABI_1.ERC20, contractAddress);
    }
    static approve(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _spender, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC20.getContract(web3, token);
            let encodeABI = contract.methods.approve(_spender, _value).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static transferFrom(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _from, _to, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC20.getContract(web3, token);
            let encodeABI = contract.methods.transferFrom(_from, _to, _value).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static transfer(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _to, _value) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC20.getContract(web3, token);
            let encodeABI = contract.methods.transfer(_to, _value).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
}
exports.ERC20 = ERC20;
class ERC721 {
    static getContract(web3, contractAddress) {
        return new web3.eth.Contract(ABI_1.ERC721, contractAddress);
    }
    static approve(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _spender, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC721.getContract(web3, token);
            let encodeABI = contract.methods.approve(_spender, _tokenId).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static transferFrom(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _from, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC721.getContract(web3, token);
            let encodeABI = contract.methods.transferFrom(_from, _to, _tokenId).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static transfer(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC721.getContract(web3, token);
            let encodeABI = contract.methods.transfer(_to, _tokenId).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static safeTransferFrom(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _from, _to, _tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC721.getContract(web3, token);
            let encodeABI = contract.methods.safeTransferFrom(_from, _to, _tokenId).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static setApprovalForAll(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _operator, _approved) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC721.getContract(web3, token);
            let encodeABI = contract.methods.setApprovalForAll(_operator, _approved).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
}
exports.ERC721 = ERC721;
class ERC1155 {
    static getContract(web3, contractAddress) {
        return new web3.eth.Contract(ABI_1.ERC1155, contractAddress);
    }
    static safeTransferFrom(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _from, _to, _id, _value, _data) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC1155.getContract(web3, token);
            let encodeABI = contract.methods.safeTransferFrom(_from, _to, _id, _value, _data).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static safeBatchTransferFrom(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _from, _to, _ids, _values, _data) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC1155.getContract(web3, token);
            let encodeABI = contract.methods.safeBatchTransferFrom(_from, _to, _ids, _values, _data).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
    static setApprovalForAll(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, _operator, _approved) {
        return __awaiter(this, void 0, void 0, function* () {
            let contract = ERC1155.getContract(web3, token);
            let encodeABI = contract.methods.setApprovalForAll(_operator, _approved).encodeABI();
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, token, encodeABI);
        });
    }
}
exports.ERC1155 = ERC1155;
class ETH {
    static transfer(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, to, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Token.createOp(web3, walletAddress, nonce, entryPointAddress, paymasterAddress, maxFeePerGas, maxPriorityFeePerGas, to, '0x', value);
        });
    }
}
exports.ETH = ETH;
//# sourceMappingURL=Token.js.map