/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:07:41
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-05 12:56:40
 */
import { WalletLib } from '../src/app';

import Web3 from 'web3';
import { keccak256 } from 'ethers/lib/utils';
import { Guard } from '../src/utils/guard';
import { DecodeCallData } from '../src/utils/decodeCallData';
import { assert } from 'console';


async function main() {

    const web3 = new Web3();


    // #region decode CallData
    {
        {
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
            const callDataDecode = await DecodeCallData.new().decode('0xfb0f3ee100000000000000000000');
            /*
                functionName:'cryethereum_please_fix_collisions_sqyq4k4l5'
                functionSignature:'cryethereum_please_fix_collisions_sqyq4k4l5()'
                params:null
             */
            assert(callDataDecode != null && callDataDecode.functionName === 'cryethereum_please_fix_collisions_sqyq4k4l5' &&
                callDataDecode.functionSignature === 'cryethereum_please_fix_collisions_sqyq4k4l5()' &&
                callDataDecode.params === null
                , 'decode call data failed');
        }
    }
    // #endregion



    // #region Guard
    {
        {
            Guard.address(web3.eth.accounts.create().address);
            let succ = false;
            try { Guard.address('0x0'); } catch (error) { succ = true; }
            if (!succ) throw new Error('Guard failed');
        }

        {
            Guard.hex('0x1');
            let succ = false;
            try { Guard.hex('1'); } catch (error) { succ = true; }
            if (!succ) throw new Error('Guard failed');
        }

        {
            Guard.keccak256(keccak256('0x'));
            let succ = false;
            try { Guard.keccak256('0x1'); } catch (error) { succ = true; }
            if (!succ) throw new Error('Guard failed');
        }

        {
            Guard.uint('1');
            Guard.uint('0');
            let succ = false;
            try { Guard.uint('-1'); } catch (error) { succ = true; }
            if (!succ) throw new Error('Guard failed');
        }
    }
    // #endregion


}

main();
