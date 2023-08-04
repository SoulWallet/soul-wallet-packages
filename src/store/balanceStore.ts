import { create } from "zustand";
import api from "@src/lib/api";
import { persist } from "zustand/middleware";

export interface ITokenBalanceItem {
    address: string;
    balance: string;
    icon: string;
    usdValue: string;
}

export interface INftBalanceItem {
    address: string;
    tokenId: string;
    balance: string;
    icon: string;
}

export interface IBalanceStore {
    tokenBalance: ITokenBalanceItem[];
    nftBalance: INftBalanceItem[];
    getTokenBalance: (tokenAddress: string) => any;
    fetchTokenBalance: (walletAddress: string) => void;
    getNftBalance: (tokenAddress: string) => any;
    fetchNftBalance: (walletAddress: string) => void;
}

export const useBalanceStore = create<IBalanceStore>()(
    persist(
        (set, get) => ({
            tokenBalance: [],
            nftBalance: [],
            getTokenBalance: async (tokenAddress: string) => {
                return get().tokenBalance.filter((item: ITokenBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchTokenBalance: async (walletAddress: string) => {
                const res = await api.balance.token({
                    walletAddress,
                });
                set({ tokenBalance: res.data });
            },
            getNftBalance: async (tokenAddress: string) => {
                return get().nftBalance.filter((item: INftBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchNftBalance: async (walletAddress: string) => {
                const res = await api.balance.nft({
                    walletAddress,
                });
                set({ nftBalance: res.data });
            },
        }),
        {
            name: "balance-storage",
        },
    ),
);
