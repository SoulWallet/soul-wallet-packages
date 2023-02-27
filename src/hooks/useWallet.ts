import useWalletContext from "../context/hooks/useWalletContext";
import useKeystore from "./useKeystore";
import { useGlobalStore } from "@src/store/global";
import useTools from "./useTools";
import useLib from "./useLib";
import { ethers } from "ethers";
import api from "@src/lib/api";
import BN from "bignumber.js";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@src/lib/tools";
import Runtime from "@src/lib/Runtime";
import useQuery from "./useQuery";
import { useSettingStore } from "@src/store/settingStore";
import { UserOperation } from "soul-wallet-lib";
import config from "@src/config";
import { GuardianItem } from "@src/lib/type";

export default function useWallet() {
    const { account, executeOperation, ethersProvider, getAccount, walletAddress } = useWalletContext();
    const { bundlerUrl } = useSettingStore();
    const { getGasPrice, getWalletType } = useQuery();
    const { getGuardianInitCode, getFeeCost } = useTools();
    const { guardians } = useGlobalStore();
    const keystore = useKeystore();

    const guardiansList = guardians && guardians.length > 0 ? guardians.map((item: any) => item.address) : [];

    const { soulWalletLib } = useLib();

    const activateWallet = async (paymaster = false) => {
        console.log("paymaster", paymaster);
        const actionName = "Activate Wallet";

        const guardianInitCode = getGuardianInitCode(guardiansList);

        const fee: any = (await soulWalletLib.Utils.suggestedGasFee.getEIP1559GasFees(config.chainId))?.medium;

        const maxFeePerGas = ethers.utils.parseUnits(Number(fee.suggestedMaxFeePerGas).toFixed(9), "gwei").toString();
        const maxPriorityFeePerGas = ethers.utils
            .parseUnits(Number(fee.suggestedMaxPriorityFeePerGas).toFixed(9), "gwei")
            .toString();

        const activateOp = soulWalletLib.activateWalletOp(
            config.contracts.walletLogic,
            config.contracts.entryPoint,
            account,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
            paymaster ? config.contracts.paymaster : config.zeroAddress,
            maxFeePerGas,
            maxPriorityFeePerGas,
        );

        await executeOperation(activateOp, actionName);
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

    const addPaymasterData: any = async (op: any, payToken: string) => {
        // important todo, extract
        const { requireAmountInWei, requireAmount } = await getFeeCost(
            op,
            payToken === config.zeroAddress ? "" : payToken,
        );

        if (payToken !== config.zeroAddress) {
            const maxUSDC = requireAmountInWei.mul(config.maxCostMultiplier);

            const maxUSDCFormatted = BN(requireAmount).multipliedBy(config.maxCostMultiplier).toFixed(4);

            const paymasterAndData = soulWalletLib.getPaymasterData(
                config.contracts.paymaster,
                config.tokens.usdc,
                maxUSDC,
            );

            // op.paymasterAndData = paymasterAndData;

            console.log(`need ${maxUSDCFormatted} USDC`);

            return paymasterAndData;
        } else {
            // op.paymasterAndData = "0x";
            console.log(`need ${requireAmount} ETH`);
            return "0x";
        }
    };

    const initRecoverWallet = async (walletAddress: string, guardians: GuardianItem[], payToken: string) => {
        const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        const currentFee = await getGasPrice();

        const newOwner = await getLocalStorage("stagingAccount");

        const usePaymaster = payToken !== config.zeroAddress;

        const op = await soulWalletLib.Guardian.transferOwner(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            usePaymaster ? config.contracts.paymaster : config.zeroAddress,
            currentFee,
            currentFee,
            newOwner,
        );

        if (!op) {
            throw new Error("recoveryOp is null");
        }

        op.paymasterAndData = await addPaymasterData(op, payToken);

        const opHash = op.getUserOpHash(config.contracts.entryPoint, config.chainId);

        const guardiansList = guardians.map((item) => item.address);

        const res: any = await api.recovery.create({
            chainId: config.chainId,
            entrypointAddress: config.contracts.entryPoint,
            newOwner,
            guardians: guardiansList,
            userOp: JSON.parse(op.toJSON()),
            opHash,
        });

        if (res.code === 200) {
            await setLocalStorage("recoverOpHash", opHash);
        } else {
            throw new Error(res.msg);
        }
    };

    const recoverWallet = async (transferOp: any, signatureList: any, opHash: string) => {
        const op = UserOperation.fromJSON(JSON.stringify(transferOp));
        const actionName = "Recover Wallet";

        signatureList.forEach((item: any) => {
            // TODO, need to judge
            item.contract = false;
        });

        const guardianInitCode = getGuardianInitCode(guardiansList);

        const isGuardianDeployed = (await getWalletType(guardianInitCode.address)) === "contract";

        const guardianInfo = await soulWalletLib.Guardian.getGuardian(ethersProvider, walletAddress);

        if (guardianInfo?.currentGuardian !== guardianInitCode.address) {
            throw new Error("Guardian address not match");
        }

        const signature = soulWalletLib.Guardian.packGuardiansSignByInitCode(
            guardianInitCode.address,
            signatureList,
            0,
            isGuardianDeployed ? "0x" : guardianInitCode.initCode,
        );

        op.signature = signature;

        await Runtime.send("execute", {
            actionName,
            operation: op.toJSON(),
            opHash,
            bundlerUrl,
        });

        await keystore.replaceAddress();
    };

    const updateGuardian = async (guardiansList: string[], payToken: string) => {
        const actionName = "Update Guardian";
        const currentFee = await getGasPrice();
        const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);

        const usePaymaster = payToken !== config.zeroAddress;

        const guardianInitCode = getGuardianInitCode(guardiansList);
        const setGuardianOp = await soulWalletLib.Guardian.setGuardian(
            ethersProvider,
            walletAddress,
            guardianInitCode.address,
            nonce,
            config.contracts.entryPoint,
            usePaymaster ? config.contracts.paymaster : config.zeroAddress,
            currentFee,
            currentFee,
        );

        if (!setGuardianOp) {
            throw new Error("setGuardianOp is null");
        }

        setGuardianOp.paymasterAndData = await addPaymasterData(setGuardianOp);

        const opHash = setGuardianOp.getUserOpHash(config.contracts.entryPoint, config.chainId);

        const signature = await keystore.sign(opHash);

        if (!signature) {
            throw new Error("Failed to sign");
        }

        setGuardianOp.signWithSignature(account, signature || "");

        await Runtime.send("execute", {
            actionName,
            operation: setGuardianOp.toJSON(),
            opHash,
            bundlerUrl,
        });

        // replace global store

        // await executeOperation(setGuardianOp, actionName);
    };

    return {
        activateWallet,
        initRecoverWallet,
        recoverWallet,
        generateWalletAddress,
        updateGuardian,
    };
}
