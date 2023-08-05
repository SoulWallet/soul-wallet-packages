import { L1KeyStore } from "@soulwallet/sdk";
import config from "@src/config";

export default function useKeystore() {
    const keystore = new L1KeyStore(config.l1Provider, config.contracts.l1Keystore);

    /**
     * Calculate guardian hash
     * @params guardians, guardian address list
     * @returns
     */
    const calcGuardianHash = (guardians: string[], threshold: number, salt?: string) => {
        return L1KeyStore.calcGuardianHash(guardians, threshold, salt);
    };


    /**
     * Get slot info
     * 
     */
    const getSlot = async (initialKey: string, initialGuardianHash: string, initialGuardianSafePeriod: number = L1KeyStore.days * 2 ) => {
        return L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
    }

    return { keystore, calcGuardianHash, getSlot };
}
