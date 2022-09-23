
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
            await Utils.sendOPWait(web3, activateOp, entryPointAddress, chainId);


        } catch (error) {
            console.error(error);
            throw new Error("simulateValidation error");
        }

    }

    // guardian
    {
        /* 
            account_guardian1: 0xbc4b82A8cd2a803bFB8e457d8D681b78D3F84957=>0x42a1294da28d5cbac9be9e3e11ffcf854ec734799dc4f7cdf34a7edafaca8a80
            account_guardian2: 0x44Aa7e13893c929Cbcf8f1966Db7aa47eA80924A=>0x233bfc84b62f7abe72ba68f83849204c146a90fa675855644d6d5b9639e9f270
            account_guardian3: 0x55fa93624E93a33415c2d0Ef0191ac9e426B840D=>0x2ff7b5feddca0d5dfe64e75ee9ceb666daf2d94cbada23c78be1bec857d0b376
        */
        const guardians = [web3.eth.accounts.privateKeyToAccount('0x42a1294da28d5cbac9be9e3e11ffcf854ec734799dc4f7cdf34a7edafaca8a80'),
        web3.eth.accounts.privateKeyToAccount('0x233bfc84b62f7abe72ba68f83849204c146a90fa675855644d6d5b9639e9f270'),
        web3.eth.accounts.privateKeyToAccount('0x2ff7b5feddca0d5dfe64e75ee9ceb666daf2d94cbada23c78be1bec857d0b376')
        ];

        {
            // add grardian  
            // for (let index = 0; index < guardians.length; index++) {
            //     const guardian = guardians[index];
            //     const gasFee = await Utils.getGasPrice(web3, chainId);
            //     let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
            //     const addGuardianOp = await WalletLib.EIP4337.Guaridian.grantGuardianRequest(
            //         web3 as any, simpleWalletAddress, nonce, guardian.address, entryPointAddress, WETHPaymasterAddress,
            //         gasFee.Max, gasFee.MaxPriority);
            //     if (!addGuardianOp) {
            //         throw new Error('addGuardianOp is null');
            //     }
            //     addGuardianOp.sign(entryPointAddress, chainId, account_user.privateKey);
            //     await Utils.sendOPWait(web3, addGuardianOp, entryPointAddress, chainId); 
            // } 
        }
        {
            // confirmation
            // for (let index = 0; index < guardians.length; index++) {
            //     const guardian = guardians[index];
            //     const gasFee = await Utils.getGasPrice(web3, chainId);
            //     let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
            //     const addGuardianOp = await WalletLib.EIP4337.Guaridian.grantGuardianConfirmation(
            //         web3 as any, simpleWalletAddress, nonce, guardian.address, entryPointAddress, WETHPaymasterAddress,
            //         gasFee.Max, gasFee.MaxPriority);
            //     if (!addGuardianOp) {
            //         throw new Error('addGuardianOp is null');
            //     }
            //     addGuardianOp.sign(entryPointAddress, chainId, account_user.privateKey);
            //     await Utils.sendOPWait(web3, addGuardianOp, entryPointAddress, chainId);
            // }
        }
        {
            // social recovery
            const newOwner = web3.eth.accounts.create();
            let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
            const gasFee = await Utils.getGasPrice(web3, chainId);
            const recoveryOp = await WalletLib.EIP4337.Guaridian.transferOwner(web3 as any, simpleWalletAddress, nonce,
                entryPointAddress, WETHPaymasterAddress, gasFee.Max, gasFee.MaxPriority, newOwner.address);
            if (!recoveryOp) {
                throw new Error('recoveryOp is null');
            }
            // get requestId
            const requestId = recoveryOp.getRequestId(entryPointAddress, chainId);
            // account_guardian1 sign
            const sign1 = WalletLib.EIP4337.Guaridian.guardianSignRequestId(requestId, guardians[0].privateKey);
            // account_guardian2 sign
            const sign2 = WalletLib.EIP4337.Guaridian.guardianSignRequestId(requestId, guardians[1].privateKey);

            // pack sign without on chain check
            //const signPack = await WalletLib.EIP4337.Guaridian.packGuardiansSignByRequestId(requestId, [sign1, sign2]);
            // pack sign with on chain check
            const signPack = await WalletLib.EIP4337.Guaridian.packGuardiansSignByRequestId(requestId, [sign1, sign2], simpleWalletAddress, web3 as any);

            recoveryOp.signature = signPack;

            // recovery now
            await Utils.sendOPWait(web3, recoveryOp, entryPointAddress, chainId);

            // recovery success

            {
                // change owner to orginal owner
                let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
                const gasFee = await Utils.getGasPrice(web3, chainId);
                const recoveryOp = await WalletLib.EIP4337.Guaridian.transferOwner(web3 as any, simpleWalletAddress, nonce,
                    entryPointAddress, WETHPaymasterAddress, gasFee.Max, gasFee.MaxPriority, account_user.address);
                if (!recoveryOp) {
                    throw new Error('recoveryOp is null');
                }
                recoveryOp.sign(entryPointAddress, chainId, newOwner.privateKey);
                await Utils.sendOPWait(web3, recoveryOp, entryPointAddress, chainId);
                console.log('change owner to orginal owner success');
            }





        }
    }
    // WETH send to account_sponser
    simpleWalletWETHBalance = parseFloat(web3.utils.fromWei(await WETHContract.methods.balanceOf(simpleWalletAddress).call() as string, 'ether'));
    if (simpleWalletWETHBalance > 0.001) {
        const gasFee = await Utils.getGasPrice(web3, chainId);
        let nonce = await WalletLib.EIP4337.Utils.getNonce(simpleWalletAddress, web3);
        let userOperation = await WalletLib.EIP4337.Tokens.ERC20.transfer(
            web3 as any, simpleWalletAddress, nonce, entryPointAddress,
            WETHPaymasterAddress, gasFee.Max, gasFee.MaxPriority,
            WETHContractAddress, account_sponser.address, web3.utils.toWei("0.00001", 'ether'));
        if (!userOperation) {
            throw new Error('userOperation is null');
        }
        // let userOperation = new WalletLib.EIP4337.UserOperation();
        // userOperation.nonce = nonce;
        // userOperation.sender = simpleWalletAddress;
        // userOperation.paymaster = WETHPaymasterAddress;
        // userOperation.maxFeePerGas = gasFee.Max;
        // userOperation.maxPriorityFeePerGas = gasFee.MaxPriority;
        if (await web3.eth.getCode(simpleWalletAddress) === '0x') {
            throw new Error('simpleWalletAddress is not active');
        }
        // userOperation.callData = web3.eth.abi.encodeFunctionCall(
        //     execFromEntryPoint,
        //     [
        //         WETHContractAddress,
        //         "0x00",
        //         WETHContract.methods.transfer(account_sponser.address, web3.utils.toHex(web3.utils.toWei("0.00001", 'ether'))).encodeABI()
        //     ]
        // );
        // userOperation.paymaster = WETHPaymasterAddress;
        // const hasEstimateGas = await userOperation.estimateGas(entryPointAddress, web3.eth.estimateGas);
        // if (!hasEstimateGas) {
        //     throw new Error('estimateGas error');
        // }
        userOperation.sign(entryPointAddress, chainId, account_user.privateKey);

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


        await Utils.sendOPWait(web3, userOperation, entryPointAddress, chainId);

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
            web3.utils.toHex(web3.utils.toWei("0.00001", 'ether')),
            "0x"
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

        await Utils.sendOPWait(web3, userOperation, entryPointAddress, chainId);

    } catch (error) {
        console.error(error);
        throw new Error("simulateValidation error");
    }


    // #endregion




}

main();
