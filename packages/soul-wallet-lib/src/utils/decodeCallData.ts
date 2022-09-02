/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-02 22:38:58
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-02 23:45:10
 */
import axios from 'axios';
import { readFileSync } from 'fs';

/* 
address
address[n][]
bool
bool[n][]
bytes
bytes[n][]
bytes1
bytes1[n][]
bytes10
bytes11
bytes12
bytes12[]
bytes13
bytes14
bytes14[]
bytes15
bytes16
bytes16[]
bytes16[][]
bytes17
bytes18
bytes18[]
bytes19
bytes2
bytes2[]
bytes20
bytes20[]
bytes21
bytes22
bytes22[5]
bytes23
bytes24
bytes24[]
bytes25
bytes26
bytes26[]
bytes27
bytes28
bytes28[]
bytes28[2]
bytes29
bytes3
bytes3[]
bytes3[2]
bytes30
bytes30[]
bytes31
bytes32
bytes32[]
bytes32[n][]
bytes4
bytes4[]
bytes4[n][]
bytes5
bytes5[]
bytes6
bytes6[]
bytes7
bytes7[]
bytes8
bytes8[]
bytes9
fixed128x18
fixed168x10
fixed32x32
fixed80x80
int104
int128
int128[n][]
int136
int16
int16[n][]
int160
int168
int176[8]
int192
int200
int216
int232
int24
int24[n][]
int248
int256
int256[n][]
int32
int32[n][]
int48
int48[11]
int56
int64
int64[]
int64[2]
int8
int8[n][]
int80
int88
int88[]
int96
string
string[n][]
ufixed128x18
ufixed80x80
uint104
uint104[]
uint112
uint112[]
uint120
uint120[]
uint128
uint128[n][]
uint136
uint144
uint152
uint16
uint16[n][]
uint160
uint160[n][]
uint168
uint176
uint184
uint192
uint200
uint208
uint216
uint224
uint232
uint24
uint24[n][]
uint240
uint248
uint248[]
uint256
uint256[n][]
uint32
uint32[n][]
uint40
uint40[n][]
uint48
uint48[]
uint56
uint64
uint64[n][]
uint72
uint72[]
uint8
uint8[n][]
uint80
uint88
uint88[]
uint96
uint96[n][]
*/

export class DecodeCallData {
    private static instance: DecodeCallData;
    private _saveToStorage: ((key: string, value: string) => any) | null = null;
    private _readFromStorage: ((key: string) => string | null) | null = null;
    private constructor() {


    }

    public static new() {
        if (!DecodeCallData.instance) {
            DecodeCallData.instance = new DecodeCallData();
        }
        return DecodeCallData.instance;
    }

    /**
     * set saveToStorage function & readFromStorage function
     * @param saveToStorage async function
     * @param readFromStorage async function
     */
    public setStorage(saveToStorage: (key: string, value: string) => any, readFromStorage: (key: string) => string | null) {
        this._saveToStorage = saveToStorage;
        this._readFromStorage = readFromStorage;
    }

    private async saveToStorage(key: string, value: string) {
        if (this._saveToStorage) {
            await this._saveToStorage(key, value);
        }
    }
    private async readFromStorage(key: string) {
        if (this._readFromStorage) {
            return await this._readFromStorage(key);
        }
        return null;
    }

    private async read4BytesMethod(bytes4: string): Promise<string | null> {
        try {
            bytes4 = bytes4.toLowerCase();
            if (bytes4.length != 10) {
                return null;
            }
            const method = await this.readFromStorage(bytes4);
            if (method) {
                return method;
            }
            const url = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${bytes4}`;
            const response = await axios.get(url);
            if (response && response.data && response.data.count &&
                response.data.results && typeof (response.data.count) === 'number' &&
                typeof (response.data.results) === 'object' && response.data.results.length > 0 &&
                typeof (response.data.results[0].text_signature) === 'string'
            ) {
                //watch_tg_invmru_10b052bb(bool,address,bool)
                const text_signature = response.data.results[0].text_signature;
                await this.saveToStorage(bytes4, text_signature);
                return text_signature;
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    public async decodeSignature(bytes4: string) {
        // {
        //     const set = new Set<string>();
        //     let j1 = await readFileSync('/Users/cejay/Downloads/signatures.json', 'utf8');
        //     let j2 = j1.split('\n');
        //     for (let i = 0; i < j2.length; i++) {
        //         const line = j2[i];
        //         let i1 = line.indexOf('(');
        //         let i2 = line.lastIndexOf(')');
        //         if (i1 > 0 && i2 > i1+1) {
        //             let a1 = line.substring(i1+1, i2);
        //             // replace all '(' with ''
        //             a1 = a1.replace(/\(/g, '').replace(/\)/g, '');
        //             let r1 = a1.split(',');
        //             for (let j = 0; j < r1.length; j++) {
        //                 const item = r1[j];
        //                 if(!set.has(item)){
        //                     set.add(item);
        //                 }
        //             }
        //         }
        //     }
        //     // print all set 
        //     for (let item of set) {
        //         console.log(item);
        //     } 
        // }
        const methodstr = await this.read4BytesMethod(bytes4);
        if (!methodstr) {
            return null;
        }
        let index1 = methodstr.indexOf('(');
        let index2 = methodstr.lastIndexOf(')');
        if (index1 > 0 && index2 > index1) {
            const method = methodstr.substring(0, index1);
            const params = methodstr.substring(index1 + 1, index2);
            // split 'address,(uint256,uint256)[],int128,(uint256,uint256)[]' to ['address', '(uint256,uint256)[]', 'int128', '(uint256,uint256)[]']
            // web3.eth.abi.decodeParameter
            // #TODO


        }
        return null;
    }
}