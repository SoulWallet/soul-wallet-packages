/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:07:41
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-02 23:45:46
 */
import { WalletLib } from '../src/app';

import Web3 from 'web3';
import { keccak256 } from 'ethers/lib/utils';
import { Guard } from '../src/utils/guard';
import { DecodeCallData } from '../src/utils/decodeCallData';


async function main() {

    const web3 = new Web3();

    //await DecodeCallData.new().decodeSignature('0x57ab89c1');

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
