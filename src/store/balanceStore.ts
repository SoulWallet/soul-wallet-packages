import { create } from "zustand";

interface IBalanceStore {
    balance: Map<string, string>;
    setBalance: (address: string, balance: string) => void;
}

export const useBalanceStore = create<IBalanceStore>()((set, get) => ({
    balance: new Map(),
    setBalance: (address: string, balance: string) => {
        set({
            balance: new Map(get().balance).set(address, balance),
        });
    },
}));
