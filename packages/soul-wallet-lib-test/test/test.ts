
import { execFromEntryPoint } from './ABI/execFromEntryPoint';
import Web3 from 'web3';
import { assert } from 'console';
import fs from 'fs';
import { Utils } from './Utils';
import * as dotenv from 'dotenv';
import { WalletLib } from 'soul-wallet-lib';

dotenv.config({ path: './test/.env' });

async function main() {

    // #region init variables

    if (!process.env.USER_PRIVATE_KEY)
        throw new Error('USER_PRIVATE_KEY is not defined');
    if (!process.env.PAYMASTER_PRIVATE_KEY)
        throw new Error('PAYMASTER_PRIVATE_KEY is not defined');
    if (!process.env.PAYMASTER_SIGN_KEY)
        throw new Error('PAYMASTER_SIGN_KEY is not defined');
    if (!process.env.BENEFICIARY_ADDR)
        throw new Error('BENEFICIARY_ADDR is not defined');
    if (!process.env.HTTP_PROVIDER)
        throw new Error('HTTP_PROVIDER is not defined');
    if (!process.env.SPONSER_KEY)
        throw new Error('SPONSER_KEY is not defined');

    /**
     * ETH provider url
     */
    //const HTTP_PROVIDER = 'https://goerli.optimism.io/';// process.env.HTTP_PROVIDER;
    const HTTP_PROVIDER = process.env.HTTP_PROVIDER;

    /**
     * paymaster private key
     */
    const PAYMASTER_PRIVATE_KEY = process.env.PAYMASTER_PRIVATE_KEY;

    /**
     * paymaster sign key
     */
    const PAYMASTER_SIGN_KEY = process.env.PAYMASTER_SIGN_KEY;

    /**
     * beneficiary address
     */
    const BENEFICIARY_ADDR = process.env.BENEFICIARY_ADDR;

    /**
     * user private key
     */
    const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

    /**
     * SPONSER_KEY
     */
    const SPONSER_KEY = process.env.SPONSER_KEY;


    /**
     * web3 instance
     */
    const web3 = new Web3(HTTP_PROVIDER);

    // get chainId ( use for generate signature、gas price)
    const chainId = await web3.eth.net.getId();
    console.log(`chainId: ${chainId}`);

    // #endregion

    // #region import accounts from private key  

    const account_sponser = web3.eth.accounts.privateKeyToAccount(SPONSER_KEY);
    const balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(account_sponser.address), 'ether'));
    if (balance < 0.1 /* 0.1 ETH */) {
        throw new Error('balance is not enough');
    }
    console.log(`account:${account_sponser.address},balance: ${balance} ETH`);

    // #endregion


    // #region EntryPoint

    /*
    https://ropsten.etherscan.io/address/0xbaecf6408a14c2bbbf62c87c554689e0ffc24c34#code
    https://goerli-optimism.etherscan.io/address/0xbaecf6408a14c2bbbf62c87c554689e0ffc24c34#code
     */
    let entryPointAddress = '0xbAecF6408a14C2bbBF62c87C554689E0FFC24C34';

    const _entryPointABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/EntryPoint.json`, 'utf8'));
    const entryPointContract = new web3.eth.Contract(_entryPointABI, entryPointAddress);

    // #endregion


    const WETHContractAddress = '0xec2a384Fa762C96140c817079768a1cfd0e908EA';
    /*
    https://goerli-optimism.etherscan.io/address/0xec2a384fa762c96140c817079768a1cfd0e908ea#code
    https://ropsten.etherscan.io/address/0xec2a384fa762c96140c817079768a1cfd0e908ea#code
    */


    const _WETHABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/WETH.json`, 'utf8'));
    const WETHContract = new web3.eth.Contract(_WETHABI, WETHContractAddress);


    // #region PayMaster

    let WETHPaymasterAddress = '0xc299849c75a38fC9c91A7254d0F51A1a385EEb7a';


    const _payMasterABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/WETHTokenPaymaster.json`, 'utf8'));
    const payMasterContract = new web3.eth.Contract(_payMasterABI, WETHPaymasterAddress);

    const depositInfo = await entryPointContract.methods.getDepositInfo(WETHPaymasterAddress).call();
    if (!depositInfo) {
        throw new Error('depositInfo is null,maybe cannot connect to entryPoint contract');
    }

    if (parseFloat(web3.utils.fromWei(depositInfo.amount as string, 'ether')) < 0.01) {
        // deposit 0.002 ETH 
        // add stake to payMaster : addStake(uint32 _unstakeDelaySec)
        const addStakeCallData = payMasterContract.methods.addStake(
            1
        ).encodeABI();
        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            WETHPaymasterAddress,
            web3.utils.toHex(web3.utils.toWei("0.02", 'ether')),
            addStakeCallData);
    }

    // #endregion




    // #region SimpleWallet
    const account_user = web3.eth.accounts.privateKeyToAccount(USER_PRIVATE_KEY);

    const simpleWalletCreateSalt = 0;

    let simpleWalletAddress = WalletLib.EIP4337.calculateWalletAddress(
        entryPointAddress,
        account_user.address,
        WETHContractAddress,
        WETHPaymasterAddress,
        simpleWalletCreateSalt);

    // get simpleWallet WETH balance
    let simpleWalletWETHBalance = parseFloat(web3.utils.fromWei(
        await WETHContract.methods.balanceOf(simpleWalletAddress).call(),
        'ether'));
    if (simpleWalletWETHBalance < 0.1) {

        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            WETHContractAddress,
            '0x00',
            WETHContract.methods.transfer(simpleWalletAddress, web3.utils.toHex(web3.utils.toWei("0.2", 'ether'))).encodeABI()
        );


    }

    if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
        // activate wallet
        const gasFee = await Utils.getGasPrice(web3, chainId);
        const activateOp = WalletLib.EIP4337.activateWalletOp(entryPointAddress, WETHPaymasterAddress,
            account_user.address, WETHContractAddress,
            gasFee.Max, gasFee.MaxPriority,
            simpleWalletCreateSalt);

        activateOp.sign(entryPointAddress, chainId, account_user.privateKey);

        try {
            const result = await entryPointContract.methods.simulateValidation(activateOp).call({
                from: WalletLib.EIP4337.Defines.AddressZero
            });
            console.log(`simulateValidation result:`, result);

            const tuple = activateOp.toTuple();
            //const handleOpsCallData = entryPointContract.methods.handleOps([activateOp], BENEFICIARY_ADDR).encodeABI();
            // const AASendTx = await Utils.signAndSendTransaction(web3,
            //     SPONSER_KEY,
            //     entryPointAddress,
            //     '0x00',
            //     handleOpsCallData);

            // console.log(`AASendTx:`, AASendTx);
            await Utils.sendOPWait(activateOp, entryPointAddress, chainId);


        } catch (error) {
            console.error(error);
            throw new Error("simulateValidation error");
        }

    }

    // WETH send to account_sponser
    simpleWalletWETHBalance = parseFloat(web3.utils.fromWei(await WETHContract.methods.balanceOf(simpleWalletAddress).call() as string, 'ether'));
    if (simpleWalletWETHBalance > 0.001) {
        const gasFee = await Utils.getGasPrice(web3, chainId);
        let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
        let userOperation = new WalletLib.EIP4337.UserOperation();
        userOperation.nonce = nonce;
        userOperation.sender = simpleWalletAddress;
        userOperation.paymaster = WETHPaymasterAddress;
        userOperation.maxFeePerGas = gasFee.Max;
        userOperation.maxPriorityFeePerGas = gasFee.MaxPriority;
        if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
            throw new Error('simpleWalletAddress is not active');
        }
        // userOperation.callData = web3.eth.abi.encodeFunctionCall(
        //     execFromEntryPoint,
        //     [
        //         account_sponser.address,
        //         web3.utils.toHex(web3.utils.toWei("0.00001", 'ether')), "0x"
        //     ]
        // );


        userOperation.callData = web3.eth.abi.encodeFunctionCall(
            execFromEntryPoint,
            [
                WETHContractAddress,
                "0x00",
                WETHContract.methods.transfer(account_sponser.address, web3.utils.toHex(web3.utils.toWei("0.00001", 'ether'))).encodeABI()
            ]
        );
        userOperation.paymaster = WETHPaymasterAddress;
        const hasEstimateGas = await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
        if (!hasEstimateGas) {
            throw new Error('estimateGas error');
        }
        userOperation.sign(entryPointAddress, chainId, account_user.privateKey);
        const handleOpsCallData = entryPointContract.methods.handleOps([userOperation], BENEFICIARY_ADDR).encodeABI();


        // #region decode CallData

        const tmpMap = new Map<string, string>();
        WalletLib.EIP4337.Utils.DecodeCallData.new().setStorage((key, value) => {
            tmpMap.set(key, value);
        }, (key) => {
            const v = tmpMap.get(key);
            if (typeof (v) === 'string') {
                return v;
            }
            return null;
        });

        const callDataDecode = await WalletLib.EIP4337.Utils.DecodeCallData.new().decode(userOperation.callData);
        console.log(`callDataDecode:`, callDataDecode);


        // #endregion


        await Utils.sendOPWait(userOperation, entryPointAddress, chainId);

    }


    // get balance of simpleWallet

    let simpleWalletAddressBalance = await WETHContract.methods.balanceOf(simpleWalletAddress).call();
    simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(simpleWalletAddressBalance, 'ether'));
    // let simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
    if (simpleWalletAddressBalance < 0.001) {
        throw new Error('simpleWalletAddressBalance is less than 0.001');
    }

    const gasFee = await Utils.getGasPrice(web3, chainId);
    let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
    let userOperation = new WalletLib.EIP4337.UserOperation();
    userOperation.nonce = nonce;
    userOperation.sender = simpleWalletAddress;
    userOperation.paymaster = WETHPaymasterAddress;
    userOperation.maxFeePerGas = Math.pow(10, 15);// gasFee.Max;
    userOperation.maxPriorityFeePerGas = Math.pow(10, 15);// gasFee.MaxPriority;
    if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
        throw new Error('simpleWalletAddress is not active');
    }

    //transfer ether from simpleWallet for test
    userOperation.callData = web3.eth.abi.encodeFunctionCall(
        execFromEntryPoint,
        [
            account_sponser.address,
            web3.utils.toHex(web3.utils.toWei("0.00001", 'ether')), "0x"
        ]
    );
    userOperation.paymaster = WETHPaymasterAddress;

    const hasEstimateGas = await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
    if (!hasEstimateGas) {
        throw new Error('estimateGas error');
    }

    userOperation.sign(entryPointAddress, chainId, account_user.privateKey);

    try {
        const result = await entryPointContract.methods.simulateValidation(userOperation).call({
            from: WalletLib.EIP4337.Defines.AddressZero
        });

        console.log(`simulateValidation result:`, result);

        await Utils.sendOPWait(userOperation, entryPointAddress, chainId);

    } catch (error) {
        console.error(error);
        throw new Error("simulateValidation error");
    }


    // #endregion




}

main();
