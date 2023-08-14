import useWalletContext from "../context/hooks/useWalletContext";
import useKeyring from "./useKeyring";
import { ethers } from "ethers";
import useSdk from "./useSdk";
import { useAddressStore } from "@src/store/address";
import Runtime from "@src/lib/Runtime";
import useQuery from "./useQuery";
import { ABI_SoulWallet } from "@soulwallet/abi";
import { useGuardianStore } from "@src/store/guardian";
import { addPaymasterAndData } from "@src/lib/tools";
import useKeystore from "./useKeystore";
import Erc20ABI from "../contract/abi/ERC20.json";
import { UserOpUtils, UserOperation } from "@soulwallet/sdk";
import useConfig from "./useConfig";
import { useChainStore } from "@src/store/chain";

export default function useWallet() {
    const { account } = useWalletContext();
    const { toggleActivatedChain } = useAddressStore();
    const { calcGuardianHash } = useKeystore();
    const { selectedChainId } = useChainStore();
    const { getGasPrice, getFeeCost } = useQuery();
    const { chainConfig } = useConfig();
    const { guardians, threshold } = useGuardianStore();
    const keystore = useKeyring();
    const { soulWallet } = useSdk();

    const activateWallet = async (index: number, payToken: string, estimateCost: boolean = false) => {
        const guardianHash = calcGuardianHash(guardians, threshold);

        const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(index, account, guardianHash);

        if (userOpRet.isErr()) {
            throw new Error(userOpRet.ERR.message);
        }

        const userOp = userOpRet.OK;

        // approve paymaster to spend ERC-20
        const soulAbi = new ethers.Interface(ABI_SoulWallet);
        const erc20Abi = new ethers.Interface(Erc20ABI);
        const to = chainConfig.paymasterTokens;
        const approveCalldata = erc20Abi.encodeFunctionData("approve", [
            chainConfig.contracts.paymaster,
            ethers.parseEther("1000"),
        ]);

        const approveCalldatas = [...new Array(to.length)].map((item: any) => approveCalldata);

        const callData = soulAbi.encodeFunctionData("executeBatch(address[],bytes[])", [to, approveCalldatas]);

        userOp.callData = callData;

        userOp.callGasLimit = `0x${(50000 * to.length + 1).toString(16)}`;

        if (estimateCost) {
            const { requiredAmount } = await getFeeCost(userOp, payToken);
            return requiredAmount;
        } else {
            await directSignAndSend(userOp, payToken);
            // IMPORTANT TODO, what if user don't wait?
            toggleActivatedChain(userOp.sender, selectedChainId);
        }
    };

    const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
        const soulAbi = new ethers.Interface(ABI_SoulWallet);
        return soulAbi.encodeFunctionData("setGuardian(bytes32,bytes32,bytes32)", [slot, guardianHash, keySignature]);
    };

    const directSignAndSend = async (userOp: UserOperation, payToken?: string) => {
        // TODO, estimate fee could be avoided

        // set 1559 fee
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
        userOp.maxFeePerGas = maxFeePerGas;
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

        // checkpaymaster
        if (payToken && payToken !== ethers.ZeroAddress) {
            const paymasterAndData = addPaymasterAndData(payToken, chainConfig.contracts.paymaster);
            userOp.paymasterAndData = paymasterAndData;
        }

        // set verificationGasLimit and callGasLimit
        // can be avoided if already set

        const gasLimit = await soulWallet.estimateUserOperationGas(userOp);

        if (gasLimit.isErr()) {
            throw new Error(gasLimit.ERR.message);
        }

        // userOp.verificationGasLimit = `0x${(1000000).toString(16)}`;

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
            userOp: UserOpUtils.userOperationToJSON(userOp),
            chainName: chainConfig.fileName,
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
        addPaymasterAndData,
        activateWallet,
        getSetGuardianCalldata,
        directSignAndSend,
        backupGuardiansOnChain,
        backupGuardiansByEmail,
        backupGuardiansByDownload,
    };
}
