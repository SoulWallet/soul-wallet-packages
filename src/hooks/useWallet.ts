import useWalletContext from "../context/hooks/useWalletContext";
import useKeyring from "./useKeyring";
import { useGlobalStore } from "@src/store/global";
import useTools from "./useTools";
import { ethers } from "ethers";
import useLib from "./useLib";
import BN from "bignumber.js";
import useSoulWallet from "./useSoulWallet";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@src/lib/tools";
import Runtime from "@src/lib/Runtime";
import useQuery from "./useQuery";
import { useSettingStore } from "@src/store/settingStore";
import config from "@src/config";
import { GuardianItem } from "@src/lib/type";

export default function useWallet() {
    const { account, ethersProvider, getAccount, walletAddress } = useWalletContext();
    const { bundlerUrl } = useSettingStore();
    const { getGasPrice, getWalletType, getFeeCost, estimateUserOperationGas } = useQuery();
    const { getGuardianInitCode } = useTools();
    const { guardians } = useGlobalStore();
    const keystore = useKeyring();
    const { soulWallet } = useSoulWallet();

    const { soulWalletLib } = useLib();

    const activateWallet = async (payToken: string, paymasterApproved: boolean, estimateCost: boolean = false) => {

        const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(0, account, ethers.ZeroHash);

        console.log('ACTIVE user op', userOpRet)

        if (userOpRet.isErr()) {
            throw new Error(userOpRet.ERR.message);
        }

        const userOp = userOpRet.OK;

        if (estimateCost) {
            return await getFeeCost(userOp, payToken === config.zeroAddress ? "" : payToken);
        } else {
            await directSignAndSend(userOp, payToken);
        }

        // const guardiansList = guardians && guardians.length > 0 ? guardians.map((item: any) => item.address) : [];

        // const guardianInitCode = getGuardianInitCode(guardiansList);

        // const op = soulWalletLib.activateWalletOp(
        //     config.contracts.walletLogic,
        //     config.contracts.entryPoint,
        //     account,
        //     config.upgradeDelay,
        //     config.guardianDelay,
        //     guardianInitCode.address,
        //     "0x",
        //     maxFeePerGas,
        //     maxPriorityFeePerGas,
        // );

        // if (paymasterApproved) {
        //     const approveData = config.assetsList
        //         .filter((item: any) => item.paymaster)
        //         .map((item: any) => ({
        //             token: item.address,
        //             spender: config.contracts.paymaster,
        //         }));

        //     const approveCallData = soulWalletLib.Tokens.ERC20.getApproveCallData(approveData);

        //     op.callGasLimit = approveCallData.callGasLimit;
        //     op.callData = approveCallData.callData;
        // }

    };

    const generateWalletAddress = async (address: string, guardiansList: string[], saveKey?: boolean) => {
        const guardianInitCode = getGuardianInitCode(guardiansList);

        const wAddress = soulWalletLib.calculateWalletAddress(
            config.contracts.walletLogic,
            config.contracts.entryPoint,
            address,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
        );

        if (saveKey) {
            await setLocalStorage("walletAddress", wAddress);
            getAccount();
        }

        return wAddress;
    };

    // const addPaymasterData: any = async (op: any, payToken: string) => {
    //     const { requireAmountInWei, requireAmount } = await getFeeCost(
    //         op,
    //         payToken === config.zeroAddress ? "" : payToken,
    //     );

    //     if (payToken !== config.zeroAddress) {
    //         const maxUSD = BN(requireAmountInWei.toString()).times(config.maxCostMultiplier).div(100);

    //         const maxUSDFormatted = BN(requireAmount.toString()).times(config.maxCostMultiplier).div(100).toFixed(4);

    //         const paymasterAndData = soulWalletLib.getPaymasterData(config.contracts.paymaster, payToken, maxUSD);

    //         console.log(`need ${maxUSDFormatted} USD`);

    //         return { paymasterAndData, requireAmountInWei: maxUSD, requireAmount: maxUSDFormatted };
    //     } else {
    //         // op.paymasterAndData = "0x";
    //         console.log(`need ${requireAmount} ${config.chainToken}`);
    //         return { paymasterAndData: "0x", requireAmountInWei, requireAmount };
    //     }
    // };

    const initRecoverWallet = async (walletAddress: string, guardians: GuardianItem[], payToken: string) => {
        // const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        // // const currentFee = await getGasPrice();
        // const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
        // const newOwner = await getLocalStorage("stagingAccount");
        // const usePaymaster = payToken !== config.zeroAddress;
        // const op = soulWalletLib.Guardian.transferOwner(
        //     walletAddress,
        //     nonce,
        //     usePaymaster ? config.contracts.paymaster : config.zeroAddress,
        //     new BN(maxFeePerGas).times(1.2).toFixed(0),
        //     new BN(maxPriorityFeePerGas).times(1.2).toFixed(0),
        //     newOwner,
        // );
        // if (!op) {
        //     throw new Error("recoveryOp is null");
        // }
        // const { paymasterAndData, requireAmountInWei } = await addPaymasterData(op, payToken);
        // op.paymasterAndData = paymasterAndData;
        // await estimateUserOperationGas(op);
        // const guardiansList = guardians.map((item) => item.address);
        // const guardianInitCode = getGuardianInitCode(guardiansList);
        // const opHash = op.getUserOpHashWithTimeRange(
        //     config.contracts.entryPoint,
        //     config.chainId,
        //     guardianInitCode.address,
        //     SignatureMode.guardian,
        // );
        // console.log("op hash", opHash);
        // const res: any = await api.recovery.create({
        //     tokenAddress: payToken,
        //     amountInWei: requireAmountInWei.toString(),
        //     chainId: config.chainId,
        //     entrypointAddress: config.contracts.entryPoint,
        //     guardianAddress: guardianInitCode.address,
        //     newOwner,
        //     guardians: guardiansList,
        //     userOp: JSON.parse(op.toJSON()),
        //     opHash,
        // });
        // if (res.code === 200) {
        //     await setLocalStorage("recoverOpHash", opHash);
        // } else {
        //     throw new Error(res.msg);
        // }
    };

    const recoverWallet = async (transferOp: any, signatureList: any, guardiansList: string[], opHash: string) => {
        // const op = UserOperation.fromJSON(JSON.stringify(transferOp));
        // for (let i = 0; i < signatureList.length; i++) {
        //     signatureList[i].contract = (await getWalletType(signatureList[i].address)) === "contract";
        // }
        // const guardianInitCode = getGuardianInitCode(guardiansList);
        // const isGuardianDeployed = (await getWalletType(guardianInitCode.address)) === "contract";
        // const guardianInfo = await soulWalletLib.Guardian.getGuardian(ethersProvider, walletAddress);
        // if (guardianInfo?.currentGuardian !== guardianInitCode.address) {
        //     throw new Error("Guardian address not match");
        // }
        // const signature = soulWalletLib.Guardian.packGuardiansSignByInitCode(
        //     guardianInitCode.address,
        //     signatureList,
        //     isGuardianDeployed ? "0x" : guardianInitCode.initCode,
        // );
        // op.signature = signature;
        // await Runtime.send("execute", {
        //     operation: op.toJSON(),
        //     opHash,
        //     bundlerUrl,
        // });
        // console.log("before replace");
        // await keystore.replaceAddress();
        // console.log("after replace");
    };

    const updateGuardian = async (guardiansList: string[], payToken: string) => {
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

        // const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);

        // const guardianInitCode = getGuardianInitCode(guardiansList);
        // const setGuardianOp = soulWalletLib.Guardian.setGuardian(
        //     walletAddress,
        //     guardianInitCode.address,
        //     nonce,
        //     "0x",
        //     maxFeePerGas,
        //     maxPriorityFeePerGas,
        // );

        // await directSignAndSend(setGuardianOp, payToken);

        // await removeLocalStorage("recoverOpHash");
    };

    const directSignAndSend = async (userOp: any, payToken?: string) => {
        // set 1559 fee
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
        userOp.maxFeePerGas = ethers.parseUnits(maxFeePerGas, "gwei");
        userOp.maxPriorityFeePerGas = ethers.parseUnits(maxPriorityFeePerGas, "gwei");

        // get gas limit
        const gasLimit = await soulWallet.estimateUserOperationGas(userOp);

        if (gasLimit.isErr()) {
            throw new Error(gasLimit.ERR.message);
        }

        // get preFund
        const preFund = await soulWallet.preFund(userOp);

        if (preFund.isErr()) {
            throw new Error(preFund.ERR.message);
        }

        const validAfter = Math.floor(Date.now() / 1000);
        const validUntil = validAfter + 3600;

        const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

        if (packedUserOpHashRet.isErr()) {
            throw new Error(packedUserOpHashRet.ERR.message);
        }
        const packedUserOpHash = packedUserOpHashRet.OK;

        const signature = await keystore.sign(packedUserOpHash.packedUserOpHash);

        if (!signature) {
            throw new Error("Failed to sign");
        }

        const packedSignatureRet = await soulWallet.packUserOpSignature(signature, packedUserOpHash.validationData);

        if (packedSignatureRet.isErr()) {
            throw new Error(packedSignatureRet.ERR.message);
        }

        userOp.signature = packedSignatureRet.OK;

        await Runtime.send("execute", {
            userOp: userOp.toJSON(),
            bundlerUrl,
        });

        // const { paymasterAndData } = await addPaymasterData(op, payToken);

        // op.paymasterAndData = paymasterAndData;

        // await estimateUserOperationGas(op);

        // const opHash = op.getUserOpHashWithTimeRange(config.contracts.entryPoint, config.chainId, account);
    };

    return {
        activateWallet,
        initRecoverWallet,
        recoverWallet,
        generateWalletAddress,
        updateGuardian,
        directSignAndSend,
    };
}
