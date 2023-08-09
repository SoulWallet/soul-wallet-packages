import useWalletContext from "../context/hooks/useWalletContext";
import useKeyring from "./useKeyring";
import { ethers } from "ethers";
import useSdk from "./useSdk";
import { useAddressStore } from "@src/store/address";
import Runtime from "@src/lib/Runtime";
import useQuery from "./useQuery";
import { useSettingStore } from "@src/store/settingStore";
import { useGuardianStore } from "@src/store/guardian";
import config from "@src/config";
import useKeystore from "./useKeystore";
import Erc20ABI from "../contract/abi/ERC20.json";

export default function useWallet() {
    const { account } = useWalletContext();
    const { selectedAddress } = useAddressStore();
    const { updateAddressItem } = useAddressStore();
    const { calcGuardianHash } = useKeystore();
    const { bundlerUrl } = useSettingStore();
    const { getGasPrice, getFeeCost } = useQuery();
    const { guardians, threshold } = useGuardianStore();
    const keystore = useKeyring();
    const { soulWallet } = useSdk();

    const activateWallet = async (payToken: string, estimateCost: boolean = false) => {
        const guardianHash = calcGuardianHash(guardians, threshold);

        const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(0, account, guardianHash);

        if (userOpRet.isErr()) {
            throw new Error(userOpRet.ERR.message);
        }

        const userOp = userOpRet.OK;

        if (payToken !== ethers.ZeroAddress) {
            const erc20Interface = new ethers.Interface(Erc20ABI);

            const callData = erc20Interface.encodeFunctionData("approve", [
                selectedAddress,
                config.contracts.paymaster,
                ethers.MaxUint256,
            ]);

            userOp.callData = callData;
        }

        if (estimateCost) {
            return await getFeeCost(userOp, payToken === config.zeroAddress ? "" : payToken);
        } else {
            await directSignAndSend(userOp, payToken);
            updateAddressItem(userOp.sender, { activated: true });
        }
    };
    const addPaymasterData: any = async (payToken: string) => {
        if (payToken === ethers.ZeroAddress) {
            return "0x";
        }

        // TODO, consider decimals
        const paymasterAndData = ethers.solidityPacked(
            ["address", "address", "uin256"],
            [config.contracts.paymaster, payToken, ethers.parseEther("1000")],
        );

        return paymasterAndData;
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
        userOp.maxFeePerGas = maxFeePerGas;
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

        // checkpaymaster
        const paymasterAndData = await addPaymasterData(userOp, payToken);

        userOp.paymasterAndData = paymasterAndData;

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
            userOp: JSON.stringify(userOp),
            bundlerUrl,
        });
    };

    const backupGuardiansOnChain = async (keystoreAddress: string, guardiansList: string[], threshold: number) => {};

    const backupGuardiansByEmail = async (keystoreAddress: string, guardiansList: string[], threshold: number) => {};

    const backupGuardiansByDownload = async (keystoreAddress: string, guardiansList: string[], threshold: number) => {
        // const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonToSave))}`;
        // const link = document.createElement("a");
        // link.setAttribute("href", dataStr);
        // link.setAttribute("target", "_blank");
        // link.setAttribute("download", generateJsonName("guardian"));
        // link.click();
    };

    return {
        activateWallet,
        updateGuardian,
        directSignAndSend,
        backupGuardiansOnChain,
        backupGuardiansByEmail,
        backupGuardiansByDownload,
    };
}
