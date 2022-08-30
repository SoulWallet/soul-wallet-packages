/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 21:02:15
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-30 11:50:18
 */

import { AbiItem } from 'web3-utils';

export interface IContract {
    ABI: AbiItem[] | AbiItem;
    bytecode: string;
}