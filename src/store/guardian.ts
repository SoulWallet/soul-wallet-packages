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
    guardians: string[];
    guardianDetails: any;
    guardianNames: string[];
    threshold: number;
    slot: any;
    slotInitInfo: any;
    recoverRecordId: any;
    guardianSignatures: any;
    setGuardians: (guardian: string[]) => void;
    setGuardianDetails: (guardianDetails: any) => void;
    setGuardianNames: (guardianNames: string[]) => void;
    setThreshold: (threshold: number) => void;
    setSlot: (slot: string) => void;
    setSlotInitInfo: (slotInitInfo: any) => void;
    setRecoverRecordId: (recoverRecordId: any) => void;
    setGuardianSignatures: (guardianSignatures: any) => void;
}

// IMPORTANT TODO, save initialKey, initialGuardianHash, initialGuardianSafePeriod
const createGuardianSlice = immer<GuardianStore>((set) => ({
    guardians: [],
    guardianDetails: null,
    guardianNames: [],
    threshold: 0,
    slot: null,
    slotInitInfo: null,
    recoverRecordId: null,
    guardianSignatures: null,
    setGuardians: (guardians: string[]) => set({ guardians }),
    setGuardianDetails: (guardianDetails: any) => set({ guardianDetails }),
    setGuardianNames: (guardianNames: string[]) => set({ guardianNames }),
    setThreshold: (threshold: number) => set({ threshold: Number(threshold) }),
    setSlot: (slot: string) => set({ slot }),
    setSlotInitInfo: (slotInitInfo: any) => set({ slotInitInfo }),
    setRecoverRecordId: (recoverRecordId: any) => set({ recoverRecordId }),
    setGuardianSignatures: (guardianSignatures: any) => set({ guardianSignatures }),
}));

export type GuardianState = ReturnType<typeof createGuardianStore>;

type GuardianStoreInitialProps = {
    guardians: GuardianItem[];
};

export const createGuardianStore = (initProps?: any) =>
    create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

export const useGuardianStore = create<GuardianStore>()(
    persist((...set) => ({ ...createGuardianSlice(...set) }), {
        name: "guardian-storage",
    }),
);
