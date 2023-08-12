import { L1KeyStore, SoulWallet } from "@soulwallet/sdk";
import config from "@src/config";
import useKeystore from "./useKeystore";

export default function useSdk() {
    const { calcGuardianHash } = useKeystore();

    const soulWallet = new SoulWallet(
        config.provider,
        config.defaultBundlerUrl,
        config.contracts.soulWalletFactory,
        config.contracts.defaultCallbackHandler,
        config.contracts.keyStoreModuleProxy,
        config.contracts.securityControlModule,
    );

    /**
     * Calculate wallet address
     * @param index, index of wallet address to calculate
     * @param initialKey, initial signer key address
     * @param initialGuardians, initial guardian address list
     * @param threshold, initial guardian threshold
     * @returns
     */
    const calcWalletAddress = async (index: number, initialKey: string, initialGuardians: string[], threshold: number, initialGuardianSafePeriod: number = L1KeyStore.days * 2 ) => {
        const initialGuardianHash = calcGuardianHash(initialGuardians, threshold);
        return await soulWallet.calcWalletAddress(index, initialKey,  initialGuardianHash, initialGuardianSafePeriod);
    };

    return { soulWallet, calcWalletAddress };
}