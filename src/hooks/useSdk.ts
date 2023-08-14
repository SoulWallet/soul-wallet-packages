import { useMemo } from "react";
import { L1KeyStore, SoulWallet } from "@soulwallet/sdk";
import { useChainStore } from "@src/store/chain";
import { useGuardianStore } from "@src/store/guardian";

export default function useSdk() {
    const { getSelectedChainItem, selectedChainId } = useChainStore();
    const { slotInitInfo } = useGuardianStore();
    const selectedChainItem = getSelectedChainItem();

    const soulWallet = useMemo(() => {
        return new SoulWallet(
            selectedChainItem.provider,
            selectedChainItem.bundlerUrl,
            selectedChainItem.contracts.soulWalletFactory,
            selectedChainItem.contracts.defaultCallbackHandler,
            selectedChainItem.contracts.keyStoreModuleProxy,
            selectedChainItem.contracts.securityControlModule,
        );
    }, [selectedChainId]);

    /**
     * Calculate wallet address
     * @param index, index of wallet address to calculate
     * @param initialKey, initial signer key address
     * @param initialGuardians, initial guardian address list
     * @param threshold, initial guardian threshold
     * @returns
     */
    const calcWalletAddress = async (index: number) => {
        console.log("calcWalletAddress", slotInitInfo);
        const { initialKey, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
        const initialKeyAddress = `0x${initialKey.slice(-40)}`;
        // TODO, talk with cejey
        const wAddress = await soulWallet.calcWalletAddress(
            index,
            initialKeyAddress,
            initialGuardianHash,
            Number(initialGuardianSafePeriod),
        );
        return wAddress.OK;
    };

    return { soulWallet, calcWalletAddress };
}
