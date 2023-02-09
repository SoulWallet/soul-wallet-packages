/**
 * Guardian
 */

import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import { EIP4337Lib } from "soul-wallet-lib";
import useTools from "./useTools";
import useQuery from "./useQuery";
import { guardianList } from "@src/config/mock";

export default function useGuardian() {
    const { walletAddress, executeOperation, ethersProvider } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const { getGuardianInitCode } = useTools();

    const updateGuardian = async (guardianAddress: string) => {
        const actionName = "Add Guardian";
        const currentFee = await getGasPrice();
        const nonce = await EIP4337Lib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );

        const guardianInitCode = getGuardianInitCode(guardianList);
        // TODO, need new guardianInitCode here
        const setGuardianOp = await EIP4337Lib.Guardian.setGuardian(
            ethersProvider,
            walletAddress,
            guardianInitCode.address,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            currentFee,
        );
        if (!setGuardianOp) {
            throw new Error("setGuardianOp is null");
        }

        await executeOperation(setGuardianOp, actionName);
    };

    return {
        updateGuardian,
    };
}
