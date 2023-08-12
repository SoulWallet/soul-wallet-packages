/**
 * Query current configs
 */
import { useChainStore } from "@src/store/chainStore";
import { useAddressStore } from "@src/store/address";

export default function useConfig() {
    const { getSelectedChainItem } = useChainStore();
    const { getSelectedAddressItem } = useAddressStore();

    const selectedChainItem = getSelectedChainItem();
    const selectedAddressItem = getSelectedAddressItem();

    return {
        selectedChainItem,
        // alias
        chainConfig: selectedChainItem,
        selectedAddressItem,
    };
}
