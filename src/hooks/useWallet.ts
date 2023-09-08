import useWalletContext from "../context/hooks/useWalletContext";
import useKeyring from "./useKeyring";
import { ethers } from "ethers";
import useSdk from "./useSdk";
import { useAddressStore } from "@src/store/address";
import useQuery from "./useQuery";
import { ABI_SoulWallet } from "@soulwallet/abi";
import { useGuardianStore } from "@src/store/guardian";
import { addPaymasterAndData } from "@src/lib/tools";
import Erc20ABI from "../contract/abi/ERC20.json";
import { UserOpUtils, UserOperation } from "@soulwallet/sdk";
import useConfig from "./useConfig";
import bgBus from "@src/lib/bgBus";
import { useChainStore } from "@src/store/chain";

export default function useWallet() {
    const { account } = useWalletContext();
    const { toggleActivatedChain, addActivatedChain, addActivatingChain } = useAddressStore();
    const { selectedChainId } = useChainStore();
    const { getFeeCost, getPrefund } = useQuery();
    const { chainConfig } = useConfig();
    const { guardians, threshold, slotInitInfo } = useGuardianStore();
    const k = useKeyring();
    const { soulWallet } = useSdk();

    const activateWallet = async (index: number, payToken: string, estimateCost: boolean = false) => {
        const { initialKey, initialGuardianHash } = slotInitInfo;
        const initialKeyAddress = `0x${initialKey.slice(-40)}`;
        const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
            index,
            initialKeyAddress,
            initialGuardianHash,
        );

        if (userOpRet.isErr()) {
            throw new Error(userOpRet.ERR.message);
        }

        let userOp = userOpRet.OK;

        // approve paymaster to spend ERC-20
        const soulAbi = new ethers.Interface(ABI_SoulWallet);
        const erc20Abi = new ethers.Interface(Erc20ABI);
        const to = chainConfig.paymasterTokens;
        const approveCalldata = erc20Abi.encodeFunctionData("approve", [
            chainConfig.contracts.paymaster,
            ethers.parseEther("1000"),
        ]);

        const approveCalldatas = [...new Array(to.length)].map(() => approveCalldata);

        const callData = soulAbi.encodeFunctionData("executeBatch(address[],bytes[])", [to, approveCalldatas]);

        userOp.callData = callData;

        userOp.callGasLimit = `0x${(50000 * to.length + 1).toString(16)}`;

        const feeCost = await getFeeCost(userOp, payToken);

        userOp = feeCost.userOp;

        if (estimateCost) {
            const { requiredAmount } = await getPrefund(userOp, payToken);
            return requiredAmount;
        } else {
            // TODO, estimate fee could be avoided
            // await signAndSend(userOp, payToken, null, true);
            signAndSend(userOp, payToken, null, true);
            // IMPORTANT TODO, what if user don't wait?
            // addActivatedChain(userOp.sender, selectedChainId);
            addActivatingChain(userOp.sender, selectedChainId);
        }
    };

    const signAndSend = (userOp: any, payToken: any, tabId: any, waitFinish: any) => {
        return bgBus.send("signAndSend", {
            chainConfig,
            userOp: UserOpUtils.userOperationToJSON(userOp),
            payToken,
            tabId,
            waitFinish,
        });
    };

    const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
        const soulAbi = new ethers.Interface(ABI_SoulWallet);
        return soulAbi.encodeFunctionData("setGuardian(bytes32,bytes32,bytes32)", [slot, guardianHash, keySignature]);
    };

    return {
        addPaymasterAndData,
        activateWallet,
        getSetGuardianCalldata,
        signAndSend,
    };
}
