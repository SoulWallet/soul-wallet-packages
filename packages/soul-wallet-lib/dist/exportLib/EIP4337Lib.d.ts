import { UserOperation } from "../entity/userOperation";
import { IContract } from "../contracts/icontract";
import { DecodeCallData } from '../utils/decodeCallData';
import { Guaridian } from "../utils/Guardian";
import { ERC1155, ERC20, ERC721, ETH } from "../utils/Token";
import { Converter } from '../utils/converter';
export declare class EIP4337Lib {
    /**
     * User Operation
     */
    static UserOperation: typeof UserOperation;
    static Utils: {
        getNonce: typeof EIP4337Lib.getNonce;
        DecodeCallData: typeof DecodeCallData;
        fromTransaction: typeof Converter.fromTransaction;
    };
    static Defines: {
        AddressZero: string;
    };
    static Guaridian: typeof Guaridian;
    static Tokens: {
        ERC20: typeof ERC20;
        ERC721: typeof ERC721;
        ERC1155: typeof ERC1155;
        ETH: typeof ETH;
    };
    /**
     * get wallet code
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @returns the wallet code hex string
     */
    static getWalletCode(entryPointAddress: string, ownerAddress: string, tokenAddress: string, payMasterAddress: string): string;
    /**
     * calculate wallet address by owner address
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @param salt the salt number,default is 0
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddress(entryPointAddress: string, ownerAddress: string, tokenAddress: string, payMasterAddress: string, salt: number, create2Factory: string): string;
    /**
     * get the userOperation for active (first time) the wallet
     * @param entryPointAddress
     * @param payMasterAddress
     * @param ownerAddress
     * @param tokenAddress WETH address
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @param salt
     * @param create2Factory
     */
    static activateWalletOp(entryPointAddress: string, payMasterAddress: string, ownerAddress: string, tokenAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, salt: number, create2Factory: string): UserOperation;
    /**
     * calculate EIP-4337 wallet address
     * @param initContract the init Contract
     * @param jsonInterface the jsonInterface of the contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddressByCode(initContract: IContract, initArgs: any[] | undefined, salt: number, create2Factory: string): string;
    /**
     * calculate EIP-4337 wallet address
     * @param initCodeHash the init code after keccak256
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns the EIP-4337 wallet address
     */
    private static calculateWalletAddressByCodeHash;
    /**
     * get nonce number from contract wallet
     * @param walletAddress the wallet address
     * @param web3 the web3 instance
     * @param defaultBlock "earliest", "latest" and "pending"
     * @returns the next nonce number
     */
    private static getNonce;
}
export { UserOperation } from "../entity/userOperation";
