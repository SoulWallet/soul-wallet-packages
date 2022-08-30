import Web3 from "web3";
export declare class Web3Helper {
    private static instance;
    private _web3;
    private constructor();
    static new(): Web3Helper;
    get web3(): Web3;
}
