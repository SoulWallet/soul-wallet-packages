import { L1KeyStore, SoulWallet } from "@soulwallet/sdk";
import config from "@src/config";
import useKeystore from "./useKeystore";
import { useChainStore } from "@src/store/chainStore";
import { useGuardianStore } from "@src/store/guardian";

export default function useSdk() {
    const { calcGuardianHash } = useKeystore();
    const { getSelectedChainItem } = useChainStore();
    const { slotInitInfo } = useGuardianStore();
    const selectedChainItem = getSelectedChainItem();

    const soulWallet = new SoulWallet(
        selectedChainItem.provider,
        selectedChainItem.bundlerUrl,
        selectedChainItem.contracts.soulWalletFactory,
        selectedChainItem.contracts.defaultCallbackHandler,
        selectedChainItem.contracts.keyStoreModuleProxy,
        selectedChainItem.contracts.securityControlModule,
    );

    /**
     * Calculate wallet address
     * @param index, index of wallet address to calculate
     * @param initialKey, initial signer key address
     * @param initialGuardians, initial guardian address list
     * @param threshold, initial guardian threshold
     * @returns
     */
    const calcWalletAddress = async (index: number) => {
        const { initialKey, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
        console.log('calcWalletAddress', slotInitInfo)
        // TODO, talk with cejey
        const wAddress = await soulWallet.calcWalletAddress(index, initialKey, initialGuardianHash, Number(initialGuardianSafePeriod))
        return wAddress.OK;
    };

    return { soulWallet, calcWalletAddress };
}
