"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const web3Helper_1 = require("./web3Helper");
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 20:12:45
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 21:27:56
 */
class Guard {
    static get web3() {
        Guard._web3 = web3Helper_1.Web3Helper.new().web3;
        return Guard._web3;
    }
    /**
     * check if the address is valid
     */
    static address(address) {
        if (!Guard.web3.utils.isAddress(address)) {
            throw new Error('Invalid address');
        }
    }
    /**
     * check if the value is Uint
     */
    static uint(value) {
        if (typeof (value) === 'string') {
            if (Guard.web3.utils.toBN(value).lt(Guard.web3.utils.toBN(0))) {
                throw new Error('Invalid uint');
            }
        }
        else if (value < 0) {
            throw new Error('Invalid uint');
        }
    }
    /**
     * check if the value is 0x....
     */
    static hex(value) {
        if (!Guard.web3.utils.isHexStrict(value)) {
            throw new Error('Invalid Strict hex');
        }
    }
    /**
     * check if the value is keccak256 hash
     */
    static keccak256(value) {
        Guard.hex(value);
        if (value.length !== 66) {
            throw new Error('Invalid keccak256 value');
        }
    }
}
exports.Guard = Guard;
//# sourceMappingURL=guard.js.map