import Web3 from "web3";
import { Web3Helper } from "./web3Helper";

/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 20:12:45
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-05 22:44:14
 */
export class Guard {

    private static _web3: Web3;
    private static get web3() {
        Guard._web3 = Web3Helper.new().web3;
        return Guard._web3;
    }


    /**
     * check if the address is valid
     */
    public static address(address: string) {
        if (!Guard.web3.utils.isAddress(address)) {
            throw new Error('Invalid address');
        }
    }

    /**
     * check if the value is Uint 
     */
    public static uint(value: string | number) {
        if (typeof (value) === 'string') {
            if (Guard.web3.utils.toBN(value).lt(Guard.web3.utils.toBN(0))) {
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
        if (!Guard.web3.utils.isHexStrict(value)) {
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