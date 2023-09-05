import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import config from "@src/config";

interface IChainItem {
    chainId: number;
    chainName: string;
    icon: any;
    contracts: any;
    provider: string;
    bundlerUrl: string;
}

interface IChainStore {
    selectedChainId: number;
    chainList: IChainItem[];
    // getSelectedChainItem: () => IChainItem;
    getSelectedChainItem: () => any;
    setSelectedChainId: (chainId: number) => void;
}

const getIndexByChainId = (chainList: IChainItem[], chainId: number) => {
    return chainList.findIndex((item: IChainItem) => item.chainId === chainId);
};

const createChainSlice = immer<IChainStore>((set, get) => ({
    // default first one
    selectedChainId: config.chainList[0].chainId,
    // IMPORTANT TODO, don't persist this
    chainList: config.chainList,
    getSelectedChainItem: () => {
        const index = getIndexByChainId(get().chainList, get().selectedChainId);
        return get().chainList[index];
    },
    setSelectedChainId: (chainId: number) =>
        set({
            selectedChainId: chainId,
        }),
}));

export const useChainStore = create<IChainStore>()(
    persist((...set) => ({ ...createChainSlice(...set) }), {
        name: "chain-storage",
        version: 4,
        // partialize: (state) => ({ selectedChainId: state.selectedChainId }),
    }),
);
