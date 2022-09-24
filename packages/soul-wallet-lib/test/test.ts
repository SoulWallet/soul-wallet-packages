/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:07:41
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-24 20:54:33
 */
import { WalletLib } from '../src/app';
import Web3 from 'web3';
import { DecodeCallData } from '../src/utils/decodeCallData';
import { assert } from 'console';
import fs from 'fs'; 
import * as dotenv from 'dotenv';
import { EIP4337Lib, UserOperation } from '../src/exportLib/EIP4337Lib';

dotenv.config({ path: './test/.env' });


async function main() {

  

    // #region decode CallData
    {
        {
            const tmpMap = new Map<string, string>();
            DecodeCallData.new().setStorage((key, value) => {
                tmpMap.set(key, value);
            }, (key) => {
                const v = tmpMap.get(key);
                if (typeof (v) === 'string') {
                    return v;
                }
                return null;
            });

            const callDataDecode = await DecodeCallData.new().decode('0x23b872dd00000000000000000000000066fe537df37ca31fab3f350367420c791223f5740000000000000000000000003d77439dd3d1dd1eaa96a95d863433948664ef010000000000000000000000000000000000000000000000000000000000000d71');
            /*
                functionName:'transferFrom'
                functionSignature:'transferFrom(address,address,uint256)'
                params:{
                    0:'0x66FE537df37cA31Fab3F350367420C791223F574',
                    1:'0x3D77439dD3d1dd1EAa96a95D863433948664EF01',
                    2:'3441'
                }
             */
            assert(callDataDecode != null && callDataDecode.functionName === 'transferFrom' &&
                callDataDecode.functionSignature === 'transferFrom(address,address,uint256)' &&
                callDataDecode.params[0] === '0x66FE537df37cA31Fab3F350367420C791223F574' &&
                callDataDecode.params[1] === '0x3D77439dD3d1dd1EAa96a95D863433948664EF01' &&
                callDataDecode.params[2] === '3441'
                , 'decode call data failed');
        } {
            let time_used = 0;
            let time_begin = new Date().getTime();
            const callDataDecode = await DecodeCallData.new().decode('0xfb0f3ee100000000000000000000');
            time_used = new Date().getTime() - time_begin;
            console.log('time_nocache', (time_used / 1000) + 's');
            /*
                functionName:'cryethereum_please_fix_collisions_sqyq4k4l5'
                functionSignature:'cryethereum_please_fix_collisions_sqyq4k4l5()'
                params:null
             */
            assert(callDataDecode != null && callDataDecode.functionName === 'cryethereum_please_fix_collisions_sqyq4k4l5' &&
                callDataDecode.functionSignature === 'cryethereum_please_fix_collisions_sqyq4k4l5()' &&
                callDataDecode.params === null
                , 'decode call data failed');

            time_begin = new Date().getTime();
            await DecodeCallData.new().decode('0xfb0f3ee100000000000000000000');
            time_used = new Date().getTime() - time_begin;
            console.log('time_cached', (time_used / 1000) + 's');
            assert(time_used < 10 /* 10 ms */, 'storage cache failed');
        }
    }
    // #endregion

}

main();
