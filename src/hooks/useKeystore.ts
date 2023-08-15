import { KeyStoreTypedDataType, L1KeyStore } from "@soulwallet/sdk";
import { useGuardianStore } from "@src/store/guardian";
import useConfig from "./useConfig";
import { ethers } from "ethers";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useKeyring from "./useKeyring";

export default function useKeystore() {
    const { chainConfig } = useConfig();
    const { slotInitInfo, slot } = useGuardianStore();
    const { account } = useWalletContext();
    const keyring = useKeyring();

    const keystore = new L1KeyStore(chainConfig.l1Provider, chainConfig.contracts.l1Keystore);

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
    const getSlot = async (
        initialKey: string,
        initialGuardianHash: string,
        initialGuardianSafePeriod: number = L1KeyStore.days * 2,
    ) => {
        return L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
    };

    const getKeyStoreInfo = (slot: string) => {
        return keystore.getKeyStoreInfo(slot);
    };

    const getActiveGuardianHash = async () => {
        const { slot } = slotInitInfo;
        const now = Math.floor(Date.now() / 1000);
        const res = await getKeyStoreInfo(slot);
        if (res.isErr()) {
            return;
        }
        const { guardianHash, pendingGuardianHash, guardianActivateAt } = res.OK;

        return {
            activeGuardianHash:
                pendingGuardianHash !== ethers.ZeroHash && guardianActivateAt < now
                    ? pendingGuardianHash
                    : guardianHash,
            guardianActivateAt,
        };
    };

    const getReplaceGuardianInfo = async (newGuardianHash: string) => {
        const { initialKey, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
        // const keyInfo = await keystore.getKeyStoreInfo(slot);
        const initialKeyAddress = `0x${initialKey.slice(-40)}`;
        if (initialKeyAddress.toLowerCase() !== account.toLowerCase()) {
            return;
        }
        const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN, slot, newGuardianHash);
        if (ret.isErr()) {
            return;
        }
        const { domain, types, value: message } = ret.OK;

        // IMPORTANT TODO, use wallet to sign
        const keySignature = await keyring.signMessageV4({ domain, types, message });

        return {
            newGuardianHash,
            keySignature,
            initialKey,
            initialGuardianHash,
            initialGuardianSafePeriod,
        };
    };

    return { keystore, calcGuardianHash, getSlot, getKeyStoreInfo, getActiveGuardianHash, getReplaceGuardianInfo };
}
