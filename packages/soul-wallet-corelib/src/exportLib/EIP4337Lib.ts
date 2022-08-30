/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 16:08:23
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-30 12:22:11
 */

import { getCreate2Address, hexlify, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { Create2Factory } from "../defines/address";
import { TransactionInfo } from "../entity/transactionInfo";
import { UserOperation } from "../entity/userOperation";
import { Guard } from "../utils/guard";
import { Web3Helper } from "../utils/web3Helper";
import { IContract } from "../contracts/icontract";
import { signUserOp } from "../utils/userOp";
import Web3 from "web3";


export class EIP4337Lib {

    /**
     * User Operation
     */
    public static UserOperation = UserOperation;


    /**
     * calculate EIP-4337 wallet address
     * @param initContract the init Contract
     * @param jsonInterface the jsonInterface of the contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns 
     */
    public static calculateWalletAddressByCode(
        initContract: IContract,
        initArgs: any[] | undefined,
        salt: number,
        create2Factory = Create2Factory): string {

        Guard.hex(initContract.bytecode);

        const web3 = Web3Helper.new().web3;
        const initCodeWithArgs = new web3.eth.Contract(initContract.ABI).deploy({
            data: initContract.bytecode,
            arguments: initArgs
        }).encodeABI();
        const initCodeHash = keccak256(initCodeWithArgs);
        return EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);

    }

    /**
     * calculate EIP-4337 wallet address
     * @param initCodeHash the init code after keccak256
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns the EIP-4337 wallet address
     */
    public static calculateWalletAddressByCodeHash(
        initCodeHash: string,
        salt: number,
        create2Factory = Create2Factory): string {

        Guard.keccak256(initCodeHash);
        Guard.uint(salt);
        Guard.address(create2Factory);

        const saltBytes32 = hexZeroPad(hexlify(salt), 32);
        return getCreate2Address(create2Factory, saltBytes32, initCodeHash);
    }


    /**
     * update gas
     * @param entryPoint the entryPoint address
     * @param userOperation the userOperation to update
     * @param estimateGasFunc  the function to estimate gas
     */
    public static async estimateGas(
        entryPoint: string,
        userOperation: UserOperation,
        estimateGasFunc: (txInfo: TransactionInfo) => Promise<number>) {

        Guard.address(entryPoint);

        userOperation.callGas = await estimateGasFunc({
            from: entryPoint,
            to: userOperation.sender,
            data: userOperation.callData,
        });
    }

    /**
     * Sign the userOperation with the given private key
     * @param userOperation the userOperation to sign
     * @param privateKey private key
     */
    public static signUserOp(
        userOperation: UserOperation,
        entryPoint: string,
        chainId: number,
        privateKey: string) {

        Guard.uint(chainId);
        Guard.address(entryPoint);

        userOperation.signature = signUserOp(userOperation, entryPoint, chainId, privateKey);
    }



    /**
     * get next nonce number from contract wallet
     * @param walletAddress the wallet address
     * @param web3 the web3 instance
     * @param defaultBlock "earliest", "latest" and "pending"
     * @returns the next nonce number
     */
    private static async getNextNonce(walletAddress: string, web3: Web3, defaultBlock = 'latest'): Promise<number> {
        Guard.address(walletAddress);
        try {
            const code = await web3.eth.getCode(walletAddress, defaultBlock);
            // check contract is exist
            if (code === '0x') {
                return 0;
            } else {
                const contract = new web3.eth.Contract([{ "inputs": [], "name": "nonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }], walletAddress);
                const nonce = await contract.methods.nonce().call();
                // try parse to number
                const nextNonce = parseInt(nonce, 10);
                if (isNaN(nextNonce)) {
                    throw new Error('nonce is not a number');
                }
                return nextNonce + 1;
            }

        } catch (error) {
            throw error;
        }
    }

    public static Utils = {
        getNextNonce: EIP4337Lib.getNextNonce
    }

}