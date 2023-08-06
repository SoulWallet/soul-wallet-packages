import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import config from "@src/config";

interface IChainItem {
    chainId: number;
    chainName: string;
    chainIcon: any;
}

interface IChainStore {
    selectedChainId: number;
    chainList: IChainItem[];
    setSelectedChainId: (chainId: number) => void;
}

// const getIndexByChainId = (addressList: IChainItem[], chainId: number) => {
//     return addressList.findIndex((item: IChainItem) => item.chainId === chainId);
// };

const createChainSlice = immer<IChainStore>((set, get) => ({
    // TODO, change var
    selectedChainId: config.chainId,
    chainList: [],
    setSelectedChainId: (chainId: number) =>
        set({
            selectedChainId: chainId,
        }),
}));

export const useChainStore = create<IChainStore>()(
    persist((...set) => ({ ...createChainSlice(...set) }), {
        name: "chain-storage",
    }),
);
