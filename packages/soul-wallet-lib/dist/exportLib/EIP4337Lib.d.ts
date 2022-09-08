import { UserOperation } from "../entity/userOperation";
import { IContract } from "../contracts/icontract";
export declare class EIP4337Lib {
    /**
     * User Operation
     */
    static UserOperation: typeof UserOperation;
    static Utils: {
        getNonce: typeof EIP4337Lib.getNonce;
    };
    static Defines: {
        AddressZero: string;
        Create2Factory: string;
    };
    /**
     * get wallet code
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @returns the wallet code hex string
     */
    static getWalletCode(entryPointAddress: string, ownerAddress: string): string;
    /**
     * calculate wallet address by owner address
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param salt the salt number,default is 0
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddress(entryPointAddress: string, ownerAddress: string, salt?: number, create2Factory?: string): string;
    /**
     * get the userOperation for active (first time) the wallet
     * @param entryPointAddress
     * @param payMasterAddress
     * @param ownerAddress
     * @param maxFeePerGas
     * @param maxPriorityFeePerGas
     * @param salt
     * @param create2Factory
     */
    static activateWalletOp(entryPointAddress: string, payMasterAddress: string, ownerAddress: string, maxFeePerGas: number, maxPriorityFeePerGas: number, salt?: number, create2Factory?: string): UserOperation;
    /**
     * calculate EIP-4337 wallet address
     * @param initContract the init Contract
     * @param jsonInterface the jsonInterface of the contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns
     */
    static calculateWalletAddressByCode(initContract: IContract, initArgs: any[] | undefined, salt: number, create2Factory?: string): string;
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
