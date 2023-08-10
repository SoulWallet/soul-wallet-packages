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
     * @param initialKey, signer key address
     * @param guardians, guardian address list
     * @param threshold, guardian threshold
     * @returns
     */
    const calcWalletAddress = async (index: number, initialKey: string, guardians: string[], threshold: number, initialGuardianSafePeriod: number = L1KeyStore.days * 2 ) => {
        const guardianHash = calcGuardianHash(guardians, threshold);
        return await soulWallet.calcWalletAddress(index, initialKey,  guardianHash, initialGuardianSafePeriod);
    };

    return { soulWallet, calcWalletAddress };
}