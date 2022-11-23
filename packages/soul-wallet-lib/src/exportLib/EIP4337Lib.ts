/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 16:08:23
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 10:49:25
 */

import { getCreate2Address, hexlify, hexZeroPad, keccak256 } from "ethers/lib/utils";
import { AddressZero } from "../defines/address";
import { UserOperation } from "../entity/userOperation";
import { Guard } from "../utils/guard";
import { Web3Helper } from "../utils/web3Helper";
import { IContract } from "../contracts/icontract";
import { SimpleWalletContract } from "../contracts/simpleWallet";
import { WalletProxyContract } from "../contracts/walletProxy";
import { DecodeCallData } from '../utils/decodeCallData';
import { Guaridian } from "../utils/Guardian";
import { ERC1155, ERC20, ERC721, ETH } from "../utils/Token";
import { RPC } from '../utils/rpc';
import { Converter } from "../utils/converter";

export class EIP4337Lib {

    /**
     * User Operation
     */
    public static UserOperation = UserOperation;

    public static Utils = {
        getNonce: EIP4337Lib.getNonce,
        DecodeCallData: DecodeCallData,
        fromTransaction: Converter.fromTransaction,
    }

    public static Defines = {
        AddressZero: AddressZero
    }

    public static Guaridian = Guaridian;

    public static Tokens = {
        ERC20: ERC20,
        ERC721: ERC721,
        ERC1155: ERC1155,
        ETH: ETH,
    };

    public static RPC = {
        eth_sendUserOperation: RPC.eth_sendUserOperation,
        eth_supportedEntryPoints: RPC.eth_supportedEntryPoints,
        waitUserOperationWeb3: RPC.waitUserOperationWeb3,
        waitUserOperationEther: RPC.waitUserOperationEther,
    }


    /**
     * 
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @returns inithex
     */
    private static getInitializeData(entryPointAddress: string, ownerAddress: string, tokenAddress: string, payMasterAddress: string) {
        // function initialize(IEntryPoint anEntryPoint, address anOwner,  IERC20 token,address paymaster)
        // encodeFunctionData
        const web3 = Web3Helper.new().web3;
        const simpleWalletContract = new web3.eth.Contract(SimpleWalletContract.ABI);
        const initializeData = simpleWalletContract.methods.initialize(entryPointAddress, ownerAddress, tokenAddress, payMasterAddress).encodeABI();
        return initializeData;
    }

    /**
     * get wallet code
     * @param walletLogicAddress the wallet logic contract address
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @returns the wallet code hex string  
     */
    public static getWalletCode(walletLogicAddress: string, entryPointAddress: string, ownerAddress: string, tokenAddress: string, payMasterAddress: string) {
        //EntryPoint anEntryPoint, address anOwner, IERC20 token, address paymaster
        const initializeData = EIP4337Lib.getInitializeData(entryPointAddress, ownerAddress, tokenAddress, payMasterAddress);
        const walletBytecode = new (Web3Helper.new().web3).eth.Contract(WalletProxyContract.ABI).deploy({
            data: WalletProxyContract.bytecode,
            arguments: [
                walletLogicAddress,
                initializeData
            ]
        }).encodeABI();
        return walletBytecode;
    }

    /**
     * calculate wallet address by owner address
     * @param walletLogicAddress the wallet logic contract address
     * @param entryPointAddress the entryPoint address
     * @param ownerAddress the owner address 
     * @param tokenAddress the WETH token address
     * @param payMasterAddress the payMaster address
     * @param salt the salt number,default is 0
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns 
     */
    public static calculateWalletAddress(
        walletLogicAddress: string,
        entryPointAddress: string,
        ownerAddress: string,
        tokenAddress: string, payMasterAddress: string,
        salt: number,
        create2Factory: string) {
        const initCodeWithArgs = EIP4337Lib.getWalletCode(walletLogicAddress, entryPointAddress, ownerAddress, tokenAddress, payMasterAddress);
        const initCodeHash = keccak256(initCodeWithArgs);
        const walletAddress = EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);
        return walletAddress;
    }

    /**
     * get the userOperation for active (first time) the wallet
     * @param walletLogicAddress the wallet logic contract address
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
        walletLogicAddress: string,
        entryPointAddress: string,
        payMasterAddress: string,
        ownerAddress: string,
        tokenAddress: string,
        maxFeePerGas: number,
        maxPriorityFeePerGas: number,
        salt: number,
        create2Factory: string) {
        const initCodeWithArgs = EIP4337Lib.getWalletCode(walletLogicAddress, entryPointAddress, ownerAddress, tokenAddress, payMasterAddress);
        const initCodeHash = keccak256(initCodeWithArgs);
        const walletAddress = EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);
        let userOperation: UserOperation = new EIP4337Lib.UserOperation();
        userOperation.nonce = 0;
        userOperation.sender = walletAddress;
        userOperation.paymasterAndData = payMasterAddress;
        userOperation.maxFeePerGas = maxFeePerGas;
        userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
        userOperation.initCode = EIP4337Lib.getPackedInitCode(create2Factory, initCodeWithArgs, salt);
        userOperation.verificationGasLimit = 100000 + 3200 + 200 * userOperation.initCode.length;
        userOperation.callGasLimit = 0;
        userOperation.callData = "0x";
        return userOperation;
    }

    private static getPackedInitCode(create2Factory: string, initCode: string, salt: number) {
        //function deploy(bytes memory _initCode, bytes32 _salt)
        const web3 = Web3Helper.new().web3;

        return create2Factory.toLowerCase() + web3.eth.abi.encodeFunctionCall(
            { "inputs": [{ "internalType": "bytes", "name": "_initCode", "type": "bytes" }, { "internalType": "bytes32", "name": "_salt", "type": "bytes32" }], "name": "deploy", "outputs": [{ "internalType": "address payable", "name": "createdContract", "type": "address" }], "stateMutability": "nonpayable", "type": "function" },
            [initCode, EIP4337Lib.number2Bytes32(salt)]).substring(2);
    }

    /**
     * calculate EIP-4337 wallet address
     * @param initContract the init Contract
     * @param initArgs the init args
     * @param salt the salt number
     * @param create2Factory create2factory address defined in EIP-2470
     * @returns 
     */
    public static calculateWalletAddressByCode(
        initContract: IContract,
        initArgs: any[] | undefined,
        salt: number,
        create2Factory: string): string {

        Guard.hex(initContract.bytecode);

        const web3 = Web3Helper.new().web3;
        const initCodeWithArgs = new web3.eth.Contract(initContract.ABI).deploy({
            data: initContract.bytecode,
            arguments: initArgs
        }).encodeABI();
        const initCodeHash = keccak256(initCodeWithArgs);
        return EIP4337Lib.calculateWalletAddressByCodeHash(initCodeHash, salt, create2Factory);

    }

    public static number2Bytes32(num: number) {
        return hexZeroPad(hexlify(num), 32);
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
        create2Factory: string): string {

        Guard.keccak256(initCodeHash);
        Guard.uint(salt);
        Guard.address(create2Factory);


        return getCreate2Address(create2Factory, EIP4337Lib.number2Bytes32(salt), initCodeHash);
    }


    /**
     * get nonce number from contract wallet
     * @param walletAddress the wallet address
     * @param web3 the web3 instance
     * @param defaultBlock "earliest", "latest" and "pending"
     * @returns the next nonce number
     */
    private static async getNonce(walletAddress: string, ethers: any, defaultBlock = 'latest'): Promise<number> {
        Guard.address(walletAddress);
        try {
            // const code = await web3.eth.getCode(walletAddress, defaultBlock);
            const code = await ethers.getCode(walletAddress, defaultBlock);

            // check contract is exist
            if (code === '0x') {
                return 0;
            } else {
                // const contract = new web3.eth.Contract([{ "inputs": [], "name": "nonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }], walletAddress);
                const contract = new ethers.Contract(walletAddress, [{ "inputs": [], "name": "nonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }])
                // const nonce = await contract.methods.nonce().call();
                const nonce = await contract.nonce();

                console.log('Nonce is', nonce);
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