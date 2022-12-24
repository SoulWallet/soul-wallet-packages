/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-11-04 21:46:05
 * @LastEditors: cejay
 * @LastEditTime: 2022-12-23 19:20:20
 */

import { execFromEntryPoint } from './ABI/execFromEntryPoint';
import Web3 from 'web3';
import { ethers } from "ethers";
import fs from 'fs';
import { Utils } from './Utils';
import { WalletLib } from 'soul-wallet-lib';
import { AbiItem } from 'web3-utils';
import axios from 'axios';
import * as ethUtil from 'ethereumjs-util';
import {
    arrayify,
    defaultAbiCoder,
    getCreate2Address,
    hexDataSlice,
    keccak256
} from 'ethers/lib/utils'

async function main() {

    // infura key for test
    const web3 = new Web3('https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18');
    const ethersProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18');
 
    // get contract code
    const code1 = await web3.eth.getCode('0x1a42F5B5Fb0332EC6d8dE685Ffe690c78D33cCB9');


    const bundlerEndpoint = 'http://35.89.2.9:3000/rpc/';


    const entryPointPath = './test/contracts/EntryPoint.sol';
    const smartWalletPath = './test/contracts/SmartWallet.sol';
    const wethPaymasterPath = './test/contracts/WETHPaymaster.sol';


    const chainId = await web3.eth.getChainId();

    // get account from web3 rpc node
    // let accounts = await web3.eth.personal.getAccounts();

    // new account
    // const walletUser = await web3.eth.accounts.create();
    // console.log(walletUser.privateKey);

    const walletUser = web3.eth.accounts.privateKeyToAccount('0xab8b37dc7b125e52c0af16402c15099871664ce616fd6090afd6264daa3dff59');

    //#region  deploy eip-2470

    const SingletonFactory = '0xce0042B868300000d44A59004Da54A005ffdcf9f';


    // check if SingletonFactory is deployed
    let code = await web3.eth.getCode(SingletonFactory);
    if (code === '0x') {
        throw new Error('SingletonFactory is not deployed');
    } else {
        console.log('SingletonFactory is deployed');
    }

    //#endregion

    //#region deploy entrypoint
    let entrypointCompile = await Utils.compileContract(entryPointPath, 'EntryPoint');
    // deploy bytecode
    let EntryPointAddress = '0x5C8b3e2232768d991Ea02ac8bEACaf824aEF0b7d';
    var _paymasterStake = web3.utils.toWei('0.1', 'ether');
    var _unstakeDelaySec = 10;
    var entrypointContract = new web3.eth.Contract(entrypointCompile.abi);
    entrypointContract.options.address = EntryPointAddress;
    console.log('EntryPointAddress: ' + EntryPointAddress);

    //#endregion



    //#region check bundle status

    const resp = await axios.post(bundlerEndpoint, WalletLib.EIP4337.RPC.eth_supportedEntryPoints(),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (resp && resp.data && Array.isArray(resp.data.result)) {
        // check if entrypoint is supported in lower case
        const EntryPointAddressLowerCase = EntryPointAddress.toLowerCase();
        const entrypointSupported = resp.data.result.find((item: any) => item.toLowerCase() === EntryPointAddressLowerCase);
        if (!entrypointSupported) {
            throw new Error('EntryPoint is not supported');
        }
    } else {
        throw new Error('get supported entrypoints failed');
    }
    console.log(resp.data);
    //#endregion

    //#region deploy wallet logic

    let walletLogicCompile = await Utils.compileContract(smartWalletPath, 'SmartWallet');
    // deploy bytecode
    let SmartWalletLogicAddress = '0xf6185eE2c8cF989Df23260e1D30b6587e423471c';

    var walletLogicContract = new web3.eth.Contract(walletLogicCompile.abi);

    console.log('SmartWalletLogicAddress: ' + SmartWalletLogicAddress);


    //#endregion

    //#region deploy weth

    const _weth_abi: AbiItem[] = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "guy",
                    "type": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "src",
                    "type": "address"
                },
                {
                    "name": "dst",
                    "type": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "dst",
                    "type": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "src",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "guy",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "src",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "dst",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "dst",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Deposit",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "src",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "wad",
                    "type": "uint256"
                }
            ],
            "name": "Withdrawal",
            "type": "event"
        }
    ];
    let WEthAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';

    var wethContract = new web3.eth.Contract(_weth_abi);

    wethContract.options.address = WEthAddress;
    console.log('WEthAddress: ' + WEthAddress);


    //#endregion

    //#region deploy wethpaymaster

    let wethPaymasterCompile = await Utils.compileContract(wethPaymasterPath, 'WETHTokenPaymaster');

    let WETHPaymasterAddress = '0x6C8AC88860fA6CebFB44C598c3E2c55cEE08b734';
    var WETHPaymasterContract = new web3.eth.Contract(wethPaymasterCompile.abi);
    console.log('WETHPaymasterAddress: ' + WETHPaymasterAddress);


    //#endregion

    //#region wethpaymaster stake

    let wethPaymasterContract = new web3.eth.Contract(wethPaymasterCompile.abi, WETHPaymasterAddress);
    // const addStakeCallData = wethPaymasterContract.methods.addStake(
    //     1
    // ).encodeABI();
    // const addStakeTx = {
    //     from: accounts[0],
    //     to: WETHPaymasterAddress,
    //     data: addStakeCallData,
    //     gas: web3.utils.toWei('10', 'Gwei'),
    //     value: _paymasterStake
    // };
    // const addStakeReceipt = await web3.eth.sendTransaction(addStakeTx);
    // //
    // const depositCallData = wethPaymasterContract.methods.deposit().encodeABI();
    // const depositTx = {
    //     from: accounts[0],
    //     to: WETHPaymasterAddress,
    //     data: depositCallData,
    //     gas: web3.utils.toWei('10', 'Gwei'),
    //     value: web3.utils.toWei('0.1', 'ether')
    // };
    // const depositReceipt = await web3.eth.sendTransaction(depositTx);
    // //console.log('addStakeReceipt: ' + JSON.stringify(addStakeReceipt));

    //#endregion

    //#region calculate wallet address


    // guardian address
    let guardianAddress = '0x0000000000000000000000000000000000000001';//WalletLib.EIP4337.Defines.AddressZero;

    let walletAddress = await WalletLib.EIP4337.calculateWalletAddress(
        SmartWalletLogicAddress, EntryPointAddress, walletUser.address, guardianAddress, WEthAddress, WETHPaymasterAddress, 0, SingletonFactory
    );
    console.log('walletAddress: ' + walletAddress);
    //#endregion
    {
        // let op1 = await WalletLib.EIP4337.Utils.fromTransaction(
        //     ethersProvider, EntryPointAddress,
        //     {
        //         from: walletAddress,
        //         to: WEthAddress,
        //         value: '0x0',
        //         gas: '0x5208',
        //         data: new ethers.utils.Interface(
        //             '[ { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }]'
        //         ).encodeFunctionData("transfer", ['0x00000000000d3b4EA88f9B3fE809D386B86F5898', web3.utils.toWei('0.18', 'ether')])
        //     },
        //     await WalletLib.EIP4337.Utils.getNonce(walletAddress, ethersProvider),
        //     parseInt(web3.utils.toWei('30', 'Gwei')),
        //     parseInt(web3.utils.toWei('2', 'Gwei')),
        //     WETHPaymasterAddress
        // );
        // if (!op1) {
        //     throw new Error('op1 failed');
        // }



        // const requestId = op1.getRequestId(EntryPointAddress, chainId);
        // const signature = await web3.eth.accounts.sign(requestId, walletUser.privateKey).signature;

        //  op1.signWithSignature(walletUser.address, signature);
        // try {
        //     const result = await entrypointContract.methods.simulateValidation(op1, false).call({
        //         from: WalletLib.EIP4337.Defines.AddressZero
        //     });
        //     console.log(`simulateValidation result:`, result);

        // } catch (error) {
        //     throw error;
        // }
    }
    {
        // let op1 = await WalletLib.EIP4337.Tokens.ERC20.transfer(ethersProvider, walletAddress,
        //     await WalletLib.EIP4337.Utils.getNonce(walletAddress, ethersProvider),
        //     EntryPointAddress, WETHPaymasterAddress, parseInt(web3.utils.toWei('30', 'Gwei')),
        //     parseInt(web3.utils.toWei('2', 'Gwei')), WEthAddress,
        //     '0x00000000000d3b4EA88f9B3fE809D386B86F5898', web3.utils.toWei('0.18', 'ether'));
        // if (!op1) {
        //     throw new Error('op1 failed');
        // }
        // const requestId = op1.getRequestId(EntryPointAddress, chainId);
        // const signature = await web3.eth.accounts.sign(requestId, walletUser.privateKey);
        // op1.signWithSignature(walletUser.address, signature.signature);
        // try {
        //     const result = await entrypointContract.methods.simulateValidation(op1, false).call({
        //         from: WalletLib.EIP4337.Defines.AddressZero
        //     });
        //     console.log(`simulateValidation result:`, result);

        // } catch (error) {
        //     throw error;
        // }

        // const raw_data = WalletLib.EIP4337.RPC.eth_sendUserOperation(op1, EntryPointAddress);

        // const resp = await axios.post(bundlerEndpoint, raw_data,
        //     {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // );
        // console.log('resp: ' + JSON.stringify(resp.data));

    }

    //#region swap eth to weth
    // account[0] send 1 eth to WEthAddress
    // const swapEthToWethTx = {
    //     from: accounts[0],
    //     to: WEthAddress,
    //     data: '0x',
    //     gas: 10000000,
    //     value: web3.utils.toWei('1', 'ether')
    // };
    // const swapEthToWethReceipt = await web3.eth.sendTransaction(swapEthToWethTx);
    // // wait for transaction to be mined
    // // get balance of weth
    // let wethBalance = await wethContract.methods.balanceOf(accounts[0]).call();
    // console.log('wethBalance: ' + web3.utils.fromWei(wethBalance, 'ether'), 'WETH');


    //#endregion

    //#region send weth to wallet

    // account[0] send 1 weth to walletAddress
    // await wethContract.methods.transfer(walletAddress, web3.utils.toWei('1', 'ether')).send({
    //     from: accounts[0],
    //     gas: 10000000,
    // });
    // get balance of weth
    let wethBalance = await wethContract.methods.balanceOf(walletAddress).call();
    console.log('Wallet wethBalance: ' + web3.utils.fromWei(wethBalance, 'ether'), 'WETH');
    //#endregion

    //#region deploy wallet
    if (true) {


        const activateOp = WalletLib.EIP4337.activateWalletOp(
            SmartWalletLogicAddress,
            EntryPointAddress,
            WETHPaymasterAddress,
            walletUser.address,
            guardianAddress,
            WEthAddress,
            parseInt(web3.utils.toWei('10', 'gwei')),
            parseInt(web3.utils.toWei('3', 'gwei')),
            0,
            SingletonFactory
        );
        {
            // calculate create2 cost
            // const singletonFactoryContract = new web3.eth.Contract([{ "inputs": [{ "internalType": "bytes", "name": "_initCode", "type": "bytes" }, { "internalType": "bytes32", "name": "_salt", "type": "bytes32" }], "name": "deploy", "outputs": [{ "internalType": "address payable", "name": "createdContract", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }], SingletonFactory);
            // const _initCode = WalletLib.EIP4337.getWalletCode(SmartWalletLogicAddress, EntryPointAddress, walletUser.address, WEthAddress, WETHPaymasterAddress);
            // const _salt = web3.utils.soliditySha3(WalletLib.EIP4337.number2Bytes32(0));
            // const create2Cost = await singletonFactoryContract.methods.deploy(_initCode, _salt).estimateGas({
            //     from: WalletLib.EIP4337.Defines.AddressZero,
            //     gas: Math.pow(10, 18),
            // });
            // console.log('create2Cost: ' + create2Cost);
        }
        {
            // get preOpGas prefund

        }
        //
        //console.log(activateOp);
        {
            // get maxFeePerGas and PriorityFeePerGas
            const gasPrice = await web3.eth.getGasPrice();
            const maxFeePerGas = parseInt(gasPrice) * 100;
            const PriorityFeePerGas = parseInt(gasPrice) * 10;


            // test gas
            // activateOp.callGasLimit = 0;
            // activateOp.maxFeePerGas
        }

        const requestId = activateOp.getRequestId(EntryPointAddress, chainId);
        {
            //  function getRequestId(UserOperation calldata userOp) public view returns (bytes32) 
            const _requestid = await entrypointContract.methods.getRequestId(activateOp).call();
            if (_requestid !== requestId) {
                throw new Error('requestId mismatch');
            }

        }


        const signature = await web3.eth.accounts.sign(requestId, walletUser.privateKey);

        activateOp.signWithSignature(walletUser.address, signature.signature);
        // await Utils.sleep(1000);
        // try {
        //     const result = await ethersProvider.call({
        //         from: WalletLib.EIP4337.Defines.AddressZero,
        //         to: EntryPointAddress,
        //         data: new ethers.utils.Interface(entrypointCompile.abi).encodeFunctionData("simulateValidation", [activateOp, false]),
        //     });
        //     const decoded = new ethers.utils.Interface(entrypointCompile.abi).decodeFunctionResult("simulateValidation", result);
        //     console.log(`simulateValidation result:`, decoded);
        // } catch (error) {
        //     throw error;
        // }

        /* 
        curl --location --request POST 'localhost:8545/' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "jsonrpc":"2.0",
        "method":"eth_sendUserOperation",
        "params":[
    {}
        ],
        entryPoint:""
        "id":1
    }'
    
        */

        // activateOp to json
        const raw_data = WalletLib.EIP4337.RPC.eth_sendUserOperation(activateOp, EntryPointAddress);

        {
            /* 
            
curl --location --request POST '35.89.2.9:3000/rpc/' \
--header 'Content-Type: application/json' \
--data-raw '{}'
            */
            // const resp = await axios.post(bundlerEndpoint, raw_data,
            //     {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // );
            // if (resp && resp.data && typeof (resp.data.result) === 'string' && resp.data.result === requestId) {
            //     console.log('requestId: ' + resp.data.result);

            //     {
            //         const arr1 = await WalletLib.EIP4337.RPC.waitUserOperation(ethersProvider, EntryPointAddress, requestId, 1000 * 5);
            //         console.log('waitUserOperation result: ', arr1);

            //     }


            // } else {
            //     throw new Error('error');
            // }
        }

        // private key to address
        console.log(new ethers.Wallet('0xfa1c00427235e07d0c33a3d25fb1a94021ea830594f486f9ee406955a2f76ff2').address);


        // deploy wallet
        if (true) {
            const handleOpsCallData = entrypointContract.methods.handleOps(
                [activateOp],
                '0x8422F18f3F17cDc06aF677e9DbfBE19999999999'
            ).encodeABI();
            let acttx;
            try {
                //const newMaxFeePerGas = Web3Helper.web3.utils.toBN(this.maxFeePerGas).mul(Web3Helper.web3.utils.toBN(2)).toNumber();
                acttx = await Utils.signAndSendTransaction(
                    web3,
                    '0xfa1c00427235e07d0c33a3d25fb1a94021ea830594f486f9ee406955a2f76ff2',
                    EntryPointAddress,
                    '0x00',
                    handleOpsCallData,
                    undefined,
                    2
                );
                console.log(acttx);

            } catch (error) {
                console.log(error);
            }
        }
    }



    //#endregion


    //#region send weth from eip4337 wallet
    //get nonce
    // get balance of weth
    if (false) {


        // wethBalance = parseInt(await wethContract.methods.balanceOf(walletAddress).call()) - Math.pow(10, 16);
        // const nonce = await WalletLib.EIP4337.Utils.getNonce(walletAddress, ethersProvider);
        // const sendErc20Op = await WalletLib.EIP4337.Tokens.ERC20.transferFrom(
        //     web3 as any, walletAddress,
        //     nonce, EntryPointAddress, WETHPaymasterAddress,
        //     parseInt(web3.utils.toWei('100', 'gwei')),
        //     parseInt(web3.utils.toWei('10', 'gwei')),
        //     WEthAddress, walletAddress, '0x8422F18f3F17cDc06aF677e9DbfBE19999999999', wethBalance + ''
        // );
        // if (!sendErc20Op) {
        //     throw new Error('sendErc20Op is null');
        // }
        // const sendErc20RequestId = sendErc20Op.getRequestId(EntryPointAddress, chainId);
        // const sendErc20Signature = await web3.eth.accounts.sign(sendErc20RequestId, walletUser.privateKey);
        // sendErc20Op.signWithSignature(walletUser.address, sendErc20Signature.signature);

        // try {
        //     //const newMaxFeePerGas = Web3Helper.web3.utils.toBN(this.maxFeePerGas).mul(Web3Helper.web3.utils.toBN(2)).toNumber();
        //     let acttx = await Utils.signAndSendTransaction(
        //         web3,
        //         '0xfa1c00427235e07d0c33a3d25fb1a94021ea830594f486f9ee406955a2f76ff2',
        //         EntryPointAddress,
        //         '0x00',
        //         entrypointContract.methods.handleOps(
        //             [sendErc20Op],
        //             '0x8422F18f3F17cDc06aF677e9DbfBE19999999999'
        //         ).encodeABI(),
        //         undefined,
        //         2
        //     );
        //     console.log(acttx);

        // } catch (error) {
        //     console.log(error);
        // }

    }



    //#endregion










}

main();
