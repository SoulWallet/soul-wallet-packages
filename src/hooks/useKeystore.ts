import { L1KeyStore } from "@soulwallet/sdk";
import config from "@src/config";
import useWalletContext from "@src/context/hooks/useWalletContext";

export default function useKeystore() {
    const keystore = new L1KeyStore(config.provider, config.contracts.l1Keystore);

    /**
     * Calculate guardian hash
     * @params guardians, guardian address list
     * @returns
     */
    const calcGuardianHash = (guardians: string[], threshold: number, salt?: string) => {
        const guardianHash = L1KeyStore.calcGuardianHash(guardians, threshold, salt);
        return guardianHash;
    };

    return { keystore, calcGuardianHash };
}
