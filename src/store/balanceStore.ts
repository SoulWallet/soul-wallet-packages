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
    fetchTokenBalance: (walletAddress: string, chainId: number) => void;
    getNftBalance: (tokenAddress: string) => any;
    fetchNftBalance: (walletAddress: string, chainId: number) => void;
}

export const useBalanceStore = create<IBalanceStore>()(
    persist(
        (set, get) => ({
            tokenBalance: [],
            nftBalance: [],
            getTokenBalance: async (tokenAddress: string) => {
                return get().tokenBalance.filter((item: ITokenBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchTokenBalance: async (walletAddress: string, chainId: number) => {
                const res = await api.balance.token({
                    wallet_address: walletAddress,
                    chain: 'arb-goerli',
                });
                set({ tokenBalance: res.data.tokenBalances });
            },
            getNftBalance: async (tokenAddress: string) => {
                return get().nftBalance.filter((item: INftBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchNftBalance: async (walletAddress: string, chainId: number) => {
                const res = await api.balance.nft({
                    wallet_address: walletAddress,
                    chain: 'arb-goerli',
                });
                set({ nftBalance: res.data });
            },
        }),
        {
            name: "balance-storage",
        },
    ),
);
