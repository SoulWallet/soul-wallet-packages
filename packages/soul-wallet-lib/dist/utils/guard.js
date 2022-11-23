"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 20:12:45
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-22 23:01:36
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const ethers_1 = require("ethers");
class Guard {
    /**
     * check if the address is valid
     */
    static address(address) {
        // ethereum address is 20 bytes
        ethers_1.ethers.utils.getAddress(address);
    }
    /**
     * check if the value is Uint
     */
    static uint(value) {
        if (typeof (value) === 'string') {
            if (ethers_1.ethers.BigNumber.from(value).lt(ethers_1.ethers.BigNumber.from(0))) {
                throw new Error('Invalid uint');
            }
        }
        else {
            if (value < 0) {
                throw new Error('Invalid uint');
            }
            else if (value % 1 !== 0) {
                throw new Error('Invalid uint');
            }
        }
    }
    /**
     * check if the value is 0x....
     */
    static hex(value) {
        if (!ethers_1.ethers.utils.isHexString(value)) {
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
    static positiveInteger(value) {
        Guard.uint(value);
        if (value === 0) {
            throw new Error('Invalid positive integer');
        }
    }
}
exports.Guard = Guard;
//# sourceMappingURL=guard.js.map