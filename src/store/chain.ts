import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import config from "@src/config";
import BN from 'bignumber.js'

interface IChainItem {
    chainId: number;
    chainIdHex: string;
    chainName: string;
    icon: any;
    contracts: any;
    provider: string;
    bundlerUrl: string;
}

interface IChainStore {
    selectedChainId: string;
    chainList: IChainItem[];
    getSelectedChainItem: () => any;
    setSelectedChainId: (chainId: string) => void;
}

const getIndexByChainId = (chainList: IChainItem[], chainId: string) => {
    return chainList.findIndex((item: IChainItem) => BN(item.chainIdHex).isEqualTo(chainId));
};

const createChainSlice = immer<IChainStore>((set, get) => ({
    // default first one
    selectedChainId: config.chainList[0].chainIdHex,
    // IMPORTANT TODO, don't persist this
    chainList: config.chainList,
    getSelectedChainItem: () => {
        const index = getIndexByChainId(get().chainList, get().selectedChainId);
        return get().chainList[index];
    },
    setSelectedChainId: (chainId: string) =>
        set({
            selectedChainId: chainId,
        }),
}));

export const useChainStore = create<IChainStore>()(
    persist((...set) => ({ ...createChainSlice(...set) }), {
        name: "chain-storage",
        version: 7,
        // partialize: (state) => ({ selectedChainId: state.selectedChainId }),
    }),
);
