/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 16:08:23
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-21 22:23:55
 */

import { getCreate2Address, hexlify, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { AddressZero, Create2Factory } from "../defines/address";
import { UserOperation } from "../entity/userOperation";
import { Guard } from "../utils/guard";
import { Web3Helper } from "../utils/web3Helper";
import { IContract } from "../contracts/icontract";
import { SimpleWalletContract } from "../contracts/simpleWallet";
import Web3 from "web3";
import { DecodeCallData } from '../utils/decodeCallData';
import { Guaridian } from "../utils/Guardian";
import { ERC1155, ERC20, ERC721 } from "../utils/Token";


export class EIP4337Lib {

    /**
     * User Operation
     */
    public static UserOperation = UserOperation;

    public static Utils = {
        getNonce: EIP4337Lib.getNonce,
        DecodeCallData: DecodeCallData
    }

    public static Defines = {
        AddressZero: AddressZero,
        Create2Factory: Create2Factory
    }

    public static Guaridian = Guaridian;

    public static Tokens = {
        ERC20: ERC20,
        ERC721: ERC721,
        ERC1155: ERC1155
    };


    /**
     * get wallet code
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @returns the wallet code hex string  
     */
    public static getWalletCode(entryPointAddress: string, ownerAddress: string, tokenAddress: string, payMasterAddress: string) {
        //EntryPoint anEntryPoint, address anOwner, IERC20 token, address paymaster
        Guard.address(entryPointAddress);
        Guard.address(ownerAddress);
        const simpleWalletBytecode = new (Web3Helper.new().web3).eth.Contract(SimpleWalletContract.ABI).deploy({
            data: SimpleWalletContract.bytecode,
            arguments: [
                entryPointAddress,
                ownerAddress,
                tokenAddress,
                payMasterAddress
            ]
        }).encodeABI();
        return simpleWalletBytecode;
    }

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
    public static calculateWalletAddress(
        entryPointAddress: string,
        ownerAddress: string,
        tokenAddress: string, payMasterAddress: string,
        salt: number = 0,
        create2Factory = Create2Factory) {
        return EIP4337Lib.calculateWalletAddressByCode(
            SimpleWalletContract,
            [entryPointAddress, ownerAddress, tokenAddress, payMasterAddress],
            salt,
            create2Factory
        );
    }

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
    public static activateWalletOp(
        entryPointAddress: string,
        payMasterAddress: string,
        ownerAddress: string,
        tokenAddress: string,
        maxFeePerGas: number,
        maxPriorityFeePerGas: number,
        salt: number = 0,
        create2Factory = Create2Factory) {
        const initCodeWithArgs = EIP4337Lib.getWalletCode(entryPointAddress, ownerAddress, tokenAddress, payMasterAddress);
        const initCodeHash = keccak256(initCodeWithArgs);
        const walletAddress = EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);
        let userOperation: UserOperation = new EIP4337Lib.UserOperation();
        userOperation.nonce = salt;//0;
        userOperation.sender = walletAddress;
        userOperation.paymaster = payMasterAddress;
        userOperation.maxFeePerGas = maxFeePerGas;
        userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
        userOperation.initCode = initCodeWithArgs;
        userOperation.verificationGas = 100000 + 3200 + 200 * userOperation.initCode.length;
        userOperation.callGas = 0;
        userOperation.callData = "0x";
        return userOperation;
    }

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
    private static calculateWalletAddressByCodeHash(
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
     * get nonce number from contract wallet
     * @param walletAddress the wallet address
     * @param web3 the web3 instance
     * @param defaultBlock "earliest", "latest" and "pending"
     * @returns the next nonce number
     */
    private static async getNonce(walletAddress: string, web3: Web3, defaultBlock = 'latest'): Promise<number> {
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
                return nextNonce;
            }

        } catch (error) {
            throw error;
        }
    }


}

export { UserOperation } from "../entity/userOperation";