/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 */
import { GuardianItem } from "@src/lib/type";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { create } from "zustand";

const DEFAULT_GUARDIAN_NUMBER = 3; // 默认guardian数
export const MAX_GUARDIAN_NUMBER = 15; // 最大guardian数
export const MIN_GUARDIAN_NUMBER = 1; // 最大guardian数

export interface GuardianStore {
    guardians: GuardianItem[];
    setGuardian: (guardian?: GuardianItem) => void;
}

const createGuardianSlice = immer<GuardianStore>((set) => ({
    guardians: [],
    threshold: 0,
    setGuardians: (guardians) => set({ guardians }),
    setThreshold: (threshold) => set({ threshold }),
}));

export type GuardianState = ReturnType<typeof createGuardianStore>;

type GuardianStoreInitialProps = {
    guardians: GuardianItem[];
};

export const createGuardianStore = (initProps?: GuardianStoreInitialProps) =>
    create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

export const useGuardianStore = create<GuardianStore>()(
    persist((...set) => ({ ...createGuardianSlice(...set) }), {
        name: "guardian-storage",
    }),
);
