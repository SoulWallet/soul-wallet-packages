import { AbiItem } from 'web3-utils';
export interface IContract {
    ABI: AbiItem[] | AbiItem;
    bytecode: string;
}
