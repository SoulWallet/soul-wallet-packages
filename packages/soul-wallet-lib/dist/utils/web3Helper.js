"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:39:57
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 21:27:41
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Helper = void 0;
const web3_1 = __importDefault(require("web3"));
class Web3Helper {
    constructor() {
        this._web3 = new web3_1.default();
    }
    static new() {
        if (!Web3Helper.instance) {
            Web3Helper.instance = new Web3Helper();
        }
        return Web3Helper.instance;
    }
    get web3() {
        return this._web3;
    }
}
exports.Web3Helper = Web3Helper;
//# sourceMappingURL=web3Helper.js.map