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
    newKey: string | null;
    guardians: string[];
    guardianDetails: any;
    guardianNames: any;
    threshold: number;

    pendingGuardians: string[];
    pendingGuardianDetails: any;
    pendingGuardianNames: any;
    pendingThreshold: number;

    slot: any;
    slotInitInfo: any;
    recoverRecordId: any;
    guardianSignatures: any;
    setNewKey: (newKey: string) => void;

    setGuardians: (guardian: string[]) => void;
    setGuardianDetails: (guardianDetails: any) => void;
    setGuardianNames: (guardianNames: string[]) => void;
    setThreshold: (threshold: number) => void;

    setPendingGuardians: (pendingGuardians: string[]) => void;
    setPendingGuardianDetails: (pendingGuardianDetails: any) => void;
    setPendingGuardianNames: (pendingGuardianNames: string[]) => void;
    setPendingThreshold: (pendingThreshold: number) => void;

    setSlot: (slot: string) => void;
    setSlotInitInfo: (slotInitInfo: any) => void;
    setRecoverRecordId: (recoverRecordId: any) => void;
    setGuardianSignatures: (guardianSignatures: any) => void;
    resetGuardians: () => void;
}

// IMPORTANT TODO, save initialKey, initialGuardianHash, initialGuardianSafePeriod
const createGuardianSlice = immer<GuardianStore>((set) => ({
    newKey: null,

    guardians: [],
    guardianDetails: null,
    guardianNames: null,
    threshold: 0,

    pendingGuardians: [],
    pendingGuardianDetails: null,
    pendingGuardianNames: null,
    pendingThreshold: 0,

    slot: null,
    slotInitInfo: null,
    recoverRecordId: null,
    guardianSignatures: null,
    setNewKey: (newKey: string) => set({ newKey }),

    setGuardians: (guardians: string[]) => set({ guardians }),
    setGuardianDetails: (guardianDetails: any) => set({ guardianDetails }),
    setGuardianNames: (guardianNames: string[]) => set({ guardianNames }),
    setThreshold: (threshold: number) => set({ threshold: Number(threshold) }),

    setPendingGuardians: (pendingGuardians: string[]) => set({ pendingGuardians }),
    setPendingGuardianDetails: (pendingGuardianDetails: any) => set({ pendingGuardianDetails }),
    setPendingGuardianNames: (pendingGuardianNames: string[]) => set({ pendingGuardianNames }),
    setPendingThreshold: (pendingThreshold: number) => set({ pendingThreshold: Number(pendingThreshold) }),

    setSlot: (slot: string) => set({ slot }),
    setSlotInitInfo: (slotInitInfo: any) => set({ slotInitInfo }),
    setRecoverRecordId: (recoverRecordId: any) => set({ recoverRecordId }),
    setGuardianSignatures: (guardianSignatures: any) => set({ guardianSignatures }),
    resetGuardians: () => {
        set({
            recoverRecordId: null,
        })
    }
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
