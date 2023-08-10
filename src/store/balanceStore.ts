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
};

export interface IBalanceStore {
    tokenBalance: ITokenBalanceItem[];
    nftBalance: INftBalanceItem[];
    getTokenBalance: (tokenAddress: string) => any;
    fetchTokenBalance: (walletAddress: string, chainId: number) => void;
    getNftBalance: (tokenAddress: string) => any;
    fetchNftBalance: (walletAddress: string, chainId: number) => void;
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
            fetchTokenBalance: async (walletAddress: string, chainId: number) => {
                const res = await api.balance.token({
                    walletAddress,
                    chainId,
                });

                const tokenList = res.data.map((item: ITokenBalanceItem) => formatTokenBalance(item));

                // format balance list here
                set({ tokenBalance: tokenList });
            },
            getNftBalance: (tokenAddress: string) => {
                return get().nftBalance.filter((item: INftBalanceItem) => item.address === tokenAddress)[0];
            },
            fetchNftBalance: async (walletAddress: string, chainId: number) => {
                const res = await api.balance.nft({
                    walletAddress: walletAddress,
                    chainId: chainId,
                });

                const nftList = res.data.ownedNfts.map((item: any) => formatNftBalance(item));

                console.log("aaaa", nftList);

                set({ nftBalance: nftList });
            },
        }),
        {
            name: "balance-storage",
        },
    ),
);
