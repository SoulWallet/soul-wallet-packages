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
    const keyStore = useKeystore();

    const guardiansList = guardians && guardians.length > 0 ? guardians.map((item: any) => item.address) : [];

    const { soulWalletLib } = useLib();

    const activateWallet = async (paymaster: boolean = false) => {
        const actionName = "Activate Wallet";

        const guardianInitCode = getGuardianInitCode(guardiansList);

        let fee: any = (await soulWalletLib.Utils.suggestedGasFee.getEIP1559GasFees(config.chainId))?.medium;

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

    const generateWalletAddress = async (address: string, guardiansList: GuardianItem[], saveKey?: boolean) => {
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

    const initRecoverWallet = async (walletAddress: string, guardians: GuardianItem[], payToken: string) => {
        let nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        const currentFee = await getGasPrice();

        const newOwner = await getLocalStorage("stagingAccount");

        const usePaymaster = payToken === config.zeroAddress;

        console.log("use paymaster", usePaymaster);

        const op = await soulWalletLib.Guardian.transferOwner(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            usePaymaster ? config.zeroAddress : config.contracts.paymaster,
            currentFee,
            currentFee,
            newOwner,
        );

        if (!op) {
            throw new Error("recoveryOp is null");
        }

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

            op.paymasterAndData = paymasterAndData;

            console.log(`need ${maxUSDCFormatted} USDC`);
        } else {
            console.log(`need ${requireAmount} ETH`);
        }

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
        console.log("op hash", opHash);

        const op = UserOperation.fromJSON(JSON.stringify(transferOp));
        const actionName = "Recover Wallet";

        signatureList.forEach((item: any) => {
            // TODO, need to judge
            item.contract = false;
        });

        const guardianInitCode = getGuardianInitCode(guardiansList);

        const isGuardianDeployed = (await getWalletType(guardianInitCode.address)) === "contract";

        let guardianInfo = await soulWalletLib.Guardian.getGuardian(ethersProvider, walletAddress);

        console.log("guardian info", guardianInfo);

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

        const res = await Runtime.send("execute", {
            actionName,
            operation: op.toJSON(),
            opHash,
            bundlerUrl,
        });

        // support succeed

        await keyStore.replaceAddress();
    };

    const deleteWallet = async () => {
        await keyStore.delete();
    };

    return {
        activateWallet,
        initRecoverWallet,
        recoverWallet,
        generateWalletAddress,
        deleteWallet,
    };
}
