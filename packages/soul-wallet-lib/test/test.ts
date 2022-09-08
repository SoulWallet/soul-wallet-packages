/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 19:07:41
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-08 20:42:11
 */
import { WalletLib } from '../src/app';
import { execFromEntryPoint } from './ABI/execFromEntryPoint';
import Web3 from 'web3';
import { DecodeCallData } from '../src/utils/decodeCallData';
import { assert } from 'console';
import fs from 'fs';
import { Utils } from './Utils';
import * as dotenv from 'dotenv';
import { EIP4337Lib, UserOperation } from '../src/exportLib/EIP4337Lib';

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
    if (balance < 1 /* 1 ETH */) {
        throw new Error('balance is not enough');
    }
    console.log(`account:${account_sponser.address},balance: ${balance} ETH`);

    // #endregion


    // #region EntryPoint

    let entryPointAddress = '0xFD623a33b866d961A5a64B7341E95a2066930b25';
    const _entryPointABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/EntryPoint.json`, 'utf8'));
    const entryPointContract = new web3.eth.Contract(_entryPointABI, entryPointAddress);

    // #endregion



    // #region PayMaster

    let payMasterAddress = '0x5351dCF170A0f8be7Bcecb1EDD3122E26a03AbF4';

    const _payMasterABI = JSON.parse(fs.readFileSync(`${__dirname}/ABI/VerifyingPaymaster.json`, 'utf8'));
    const payMasterContract = new web3.eth.Contract(_payMasterABI, payMasterAddress);

    const depositInfo = await entryPointContract.methods.getDepositInfo(payMasterAddress).call();
    if (!depositInfo) {
        throw new Error('depositInfo is null,maybe cannot connect to entryPoint contract');
    }

    if (depositInfo.staked === false ||
        parseFloat(web3.utils.fromWei(depositInfo.stake as string, 'ether')) < 0.05) {
        // deposit 0.1 ETH
        const depositCallData = payMasterContract.methods.deposit().encodeABI();
        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            payMasterAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            depositCallData);

        // add stake to payMaster : addStake(uint32 _unstakeDelaySec)
        const addStakeCallData = payMasterContract.methods.addStake(
            60 * 60 * 24 * 10 // 10 days
        ).encodeABI();
        await Utils.signAndSendTransaction(web3,
            account_sponser.privateKey,
            payMasterAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            addStakeCallData);
    }

    // #endregion



    // #region SimpleWallet
    const account_user = web3.eth.accounts.privateKeyToAccount(USER_PRIVATE_KEY);

    const simpleWalletCreateSalt = 0;

    const simpleWalletAddress = WalletLib.EIP4337.calculateWalletAddress(entryPointAddress, account_user.address, simpleWalletCreateSalt);
    if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
        // activate wallet
        const gasFee = await Utils.getGasPrice(chainId);
        const activateOp = WalletLib.EIP4337.activateWalletOp(entryPointAddress, payMasterAddress,
            account_user.address, gasFee.Max, gasFee.MaxPriority, simpleWalletCreateSalt);

        const paymasterSignHash = activateOp.payMasterSignHash();
        console.log(`paymasterSignHash`, paymasterSignHash);
        activateOp.paymasterData = Utils.signPayMasterHash(paymasterSignHash, PAYMASTER_SIGN_KEY)
        console.log(`paymasterData`, activateOp.paymasterData);
        activateOp.sign(entryPointAddress, chainId, account_user.privateKey);

        try {
            const result = await entryPointContract.methods.simulateValidation(activateOp).call({
                from: EIP4337Lib.Defines.AddressZero
            });
            console.log(`simulateValidation result:`, result);
            if (true) {
                const handleOpsCallData = entryPointContract.methods.handleOps([activateOp], BENEFICIARY_ADDR).encodeABI();
                const AASendTx = await Utils.signAndSendTransaction(web3,
                    SPONSER_KEY,
                    entryPointAddress,
                    '0x00',
                    handleOpsCallData);
                console.log(`AASendTx:`, AASendTx);
            }
        } catch (error) {
            console.error(error);
            throw new Error("simulateValidation error");
        }

    }

    // get balance of simpleWallet
    let simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
    if (simpleWalletAddressBalance < 0.1) {
        // send some ether to simpleWallet for test
        await Utils.signAndSendTransaction(web3,
            SPONSER_KEY,
            simpleWalletAddress,
            web3.utils.toHex(web3.utils.toWei("0.1", 'ether')),
            undefined);
        simpleWalletAddressBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(simpleWalletAddress)));
        if (simpleWalletAddressBalance < 0.1) {
            throw new Error('simpleWalletAddressBalance is less than 0.0001');
        }
    }

    const gasFee = await Utils.getGasPrice(chainId);
    let nonce = await EIP4337Lib.Utils.getNonce(simpleWalletAddress, web3);
    let userOperation: UserOperation = new EIP4337Lib.UserOperation();
    userOperation.nonce = nonce;
    userOperation.sender = simpleWalletAddress;
    userOperation.paymaster = payMasterAddress;
    userOperation.maxFeePerGas = gasFee.Max;
    userOperation.maxPriorityFeePerGas = gasFee.MaxPriority;
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
    // transferOwner(address account)
    // console.log(`transferOwner(address account):`, web3.eth.abi.encodeFunctionCall({
    //     name: 'transferOwner',
    //     type: 'function',
    //     inputs: [{
    //         type: 'address',
    //         name: 'account'
    //     }],
    // }, [account_sponser.address]));



    await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);


    const signData = await Utils.signOp([userOperation]);
    if (!signData || signData.length !== 1) {
        throw new Error('signData is null');
    }
    userOperation.paymaster = signData[0].paymaster;
    userOperation.paymasterData = signData[0].paymasterData;

    userOperation.sign(entryPointAddress, chainId, account_user.privateKey);

    try {
        const result = await entryPointContract.methods.simulateValidation(userOperation).call({
            from: EIP4337Lib.Defines.AddressZero
        });
      
        console.log(`simulateValidation result:`, result);

        const signData = await Utils.sendOp([userOperation]);
        console.log(`signData:`, signData);


    } catch (error) {
        console.error(error);
        throw new Error("simulateValidation error");
    }


    // #endregion


    // #region decode CallData
    {
        {
            const tmpMap = new Map<string, string>();
            DecodeCallData.new().setStorage((key, value) => {
                tmpMap.set(key, value);
            }, (key) => {
                const v = tmpMap.get(key);
                if (typeof (v) === 'string') {
                    return v;
                }
                return null;
            });

            const callDataDecode = await DecodeCallData.new().decode('0x23b872dd00000000000000000000000066fe537df37ca31fab3f350367420c791223f5740000000000000000000000003d77439dd3d1dd1eaa96a95d863433948664ef010000000000000000000000000000000000000000000000000000000000000d71');
            /*
                functionName:'transferFrom'
                functionSignature:'transferFrom(address,address,uint256)'
                params:{
                    0:'0x66FE537df37cA31Fab3F350367420C791223F574',
                    1:'0x3D77439dD3d1dd1EAa96a95D863433948664EF01',
                    2:'3441'
                }
             */
            assert(callDataDecode != null && callDataDecode.functionName === 'transferFrom' &&
                callDataDecode.functionSignature === 'transferFrom(address,address,uint256)' &&
                callDataDecode.params[0] === '0x66FE537df37cA31Fab3F350367420C791223F574' &&
                callDataDecode.params[1] === '0x3D77439dD3d1dd1EAa96a95D863433948664EF01' &&
                callDataDecode.params[2] === '3441'
                , 'decode call data failed');
        } {
            let time_used = 0;
            let time_begin = new Date().getTime();
            const callDataDecode = await DecodeCallData.new().decode('0xfb0f3ee100000000000000000000');
            time_used = new Date().getTime() - time_begin;
            console.log('time_nocache', (time_used / 1000) + 's');
            /*
                functionName:'cryethereum_please_fix_collisions_sqyq4k4l5'
                functionSignature:'cryethereum_please_fix_collisions_sqyq4k4l5()'
                params:null
             */
            assert(callDataDecode != null && callDataDecode.functionName === 'cryethereum_please_fix_collisions_sqyq4k4l5' &&
                callDataDecode.functionSignature === 'cryethereum_please_fix_collisions_sqyq4k4l5()' &&
                callDataDecode.params === null
                , 'decode call data failed');

            time_begin = new Date().getTime();
            await DecodeCallData.new().decode('0xfb0f3ee100000000000000000000');
            time_used = new Date().getTime() - time_begin;
            console.log('time_cached', (time_used / 1000) + 's');
            assert(time_used < 10 /* 10 ms */, 'storage cache failed');
        }
    }
    // #endregion

}

main();
