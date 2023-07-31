import { SoulWallet } from "@soulwallet/sdk";
import config from "@src/config";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useKeystore from "./useKeystore";

export default function useKeyring() {
    const { calcGuardianHash } = useKeystore();

    const soulWallet = new SoulWallet(
        config.provider,
        config.defaultBundlerUrl,
        config.contracts.soulWalletFactory,
        config.contracts.defaultCallbackHandler,
        config.contracts.keyStoreModule,
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
    const calcWalletAddress = async (index: number, initialKey: string, guardians: string[], threshold: number) => {
        const guardianHash = calcGuardianHash(guardians, threshold);

        const walletAddress = await soulWallet.calcWalletAddress(index, initialKey, guardianHash);

        return walletAddress;
    };

    return { soulWallet, calcWalletAddress };
}
