import { create } from "zustand";
import api from "@src/lib/api";
import { persist } from "zustand/middleware";
import { ethers } from "ethers";
import IconDefaultToken from "@src/assets/tokens/default.svg";
import IconEth from "@src/assets/tokens/eth.svg";
import { formatIPFS } from "@src/lib/tools";

export interface ITokenBalanceItem {
    chainId: number;
    contractAddress: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
    tokenBalance: string;
    tokenBalanceFormatted: string;
    type?: number;
}

export interface INftBalanceItem {
    address: string;
    tokenId: string;
    balance: number;
    icon: string;
}

const defaultEthBalance: ITokenBalanceItem = {
    chainId: 1,
    contractAddress: ethers.ZeroAddress,
    decimals: 18,
    logoURI: IconEth,
    name: "Ethereum",
    symbol: "ETH",
    tokenBalance: "0",
    tokenBalanceFormatted: "0",
};

export interface IBalanceStore {
    tokenBalance: ITokenBalanceItem[];
    nftBalance: INftBalanceItem[];
    getTokenBalance: (tokenAddress: string) => any;
    fetchTokenBalance: (address: string, chainId: number) => void;
    getNftBalance: (tokenAddress: string) => any;
    fetchNftBalance: (address: string, chainId: number) => void;
}

const formatTokenBalance = (item: ITokenBalanceItem) => {
    if (!item.logoURI) {
        item.logoURI = IconDefaultToken;
    }
    if (!item.symbol) {
        item.symbol = "Unknown";
    }
    if (!item.name) {
        item.name = "Unknown";
    }
    if (item.tokenBalance) {
        item.tokenBalanceFormatted = ethers.formatUnits(item.tokenBalance, item.decimals);
    }
    return item;
};

const formatNftBalance = (item: any) => {
    const ipfsUrl = item.rawMetadata.image;

    return {
        logoURI: formatIPFS(ipfsUrl),
        title: item.title,
        tokenId: item.tokenId,
        balance: item.balance,
        tokenType: item.tokenType,
    };
};

export const useBalanceStore = create<IBalanceStore>()(
    persist(
        (set, get) => ({
            tokenBalance: [defaultEthBalance],
            nftBalance: [],
            getTokenBalance: (tokenAddress: string) => {
                return get().tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === tokenAddress)[0];
            },
            fetchTokenBalance: async (address: string, chainId: number) => {
                const res = await api.balance.token({
                    walletAddress: address,
                    chainId,
                });

                const tokenList = res.data.map((item: ITokenBalanceItem) => formatTokenBalance(item));

                // format balance list here
                set({ tokenBalance: tokenList });
            },
            getNftBalance: (tokenAddress: string) => {
                return get().nftBalance.filter((item: INftBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchNftBalance: async (address: string, chainId: number) => {
                const res = await api.balance.nft({
                    walletAddress: address,
                    chainId: chainId,
                });

                const nftList = res.data.ownedNfts.map((item: any) => formatNftBalance(item));

                set({ nftBalance: nftList });
            },
        }),
        {
            name: "balance-storage",
        },
    ),
);
