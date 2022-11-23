/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 20:12:45
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-22 23:01:36
 */

import { ethers } from "ethers";
export class Guard {

    /**
     * check if the address is valid
     */
    public static address(address: string) {
        // ethereum address is 20 bytes
        ethers.utils.getAddress(address);
    }

    /**
     * check if the value is Uint 
     */
    public static uint(value: string | number) {
        if (typeof (value) === 'string') {
            if (ethers.BigNumber.from(value).lt( ethers.BigNumber.from(0))) {
                throw new Error('Invalid uint');
            }
        } else {
            if (value < 0) {
                throw new Error('Invalid uint');
            } else if (value % 1 !== 0) {
                throw new Error('Invalid uint');
            }
        }
    }

    /**
     * check if the value is 0x....
     */
    public static hex(value: string) {
        if (!ethers.utils.isHexString(value)) {
            throw new Error('Invalid Strict hex');
        }
    }

    /**
     * check if the value is keccak256 hash 
     */
    public static keccak256(value: string) {
        Guard.hex(value);
        if (value.length !== 66) {
            throw new Error('Invalid keccak256 value');
        }
    }

    public static positiveInteger(value: number) {
        Guard.uint(value);
        if (value === 0) {
            throw new Error('Invalid positive integer');
        }
    }

}