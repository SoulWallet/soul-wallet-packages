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
    guardianNames: any;
    threshold: number;
    slot: any;
    slotInitInfo: any;

    newKey: string | null;
    recoverRecordId: any;
    guardianSignatures: any;
    recoveringGuardians: string[];
    recoveringGuardianNames: any;
    recoveringThreshold: number;
    recoveringSlot: any;
    recoveringSlotInitInfo: any;
    isRecovering: boolean;

    editingGuardians: string[];
    editingGuardianNames: any;
    editingThreshold: number;
    editingGuardiansInfo: any;
    cancelEditingGuardiansInfo: any;
    isEditing: boolean;

    setGuardians: (guardian: string[]) => void;
    setGuardianNames: (guardianNames: string[]) => void;
    setThreshold: (threshold: number) => void;
    setSlot: (slot: string) => void;
    setSlotInitInfo: (slotInitInfo: any) => void;
    getSlotInitInfo: () => any;

    setNewKey: (newKey: string) => void;
    setRecoverRecordId: (recoverRecordId: any) => void;
    setGuardianSignatures: (guardianSignatures: any) => void;
    setRecoveringGuardians: (recoveringGuardians: string[]) => void;
    setRecoveringGuardianNames: (recoveringGuardianNames: string[]) => void;
    setRecoveringThreshold: (recoveringThreshold: number) => void;
    setRecoveringSlot: (recoveringSlot: string) => void;
    setRecoveringSlotInitInfo: (recoveringSlotInitInfo: any) => void;
    setIsRecovering: (isRecovering: boolean) => void;

    setEditingGuardians: (editingGuardians: string[]) => void;
    setEditingGuardianNames: (editingGuardianNames: string[]) => void;
    setEditingThreshold: (editingThreshold: number) => void;
    setEditingGuardiansInfo: (editingGuardiansInfo: any) => void;
    setCancelEditingGuardiansInfo: (cancelEditingGuardiansInfo: any) => void;
    setIsEditing: (isEditing: boolean) => void;
}

const createGuardianSlice = immer<GuardianStore>((set, get) => ({
    guardians: [],
    guardianNames: null,
    threshold: 0,
    slot: null,
    slotInitInfo: null,

    newKey: null,
    recoverRecordId: null,
    guardianSignatures: null,
    recoveringGuardians: [],
    recoveringGuardianNames: null,
    recoveringThreshold: 0,
    recoveringSlot: null,
    recoveringSlotInitInfo: null,
    isRecovering: false,

    editingGuardians: [],
    editingGuardianNames: null,
    editingThreshold: 0,
    editingGuardiansInfo: null,
    cancelEditingGuardiansInfo: null,
    isEditing: false,

    setGuardians: (guardians: string[]) => set({ guardians }),
    setGuardianNames: (guardianNames: string[]) => set({ guardianNames }),
    setThreshold: (threshold: number) => set({ threshold }),
    setSlot: (slot: string) => set({ slot }),
    setSlotInitInfo: (slotInitInfo: any) => set({ slotInitInfo }),
    getSlotInitInfo: () => {
        return get().slotInitInfo
    },

    setNewKey: (newKey: string) => set({ newKey }),
    setRecoverRecordId: (recoverRecordId: any) => set({ recoverRecordId }),
    setGuardianSignatures: (guardianSignatures: any) => set({ guardianSignatures }),
    setRecoveringGuardians: (recoveringGuardians: string[]) => set({ recoveringGuardians }),
    setRecoveringGuardianNames: (recoveringGuardianNames: string[]) => set({ recoveringGuardianNames }),
    setRecoveringThreshold: (recoveringThreshold: number) => set({ recoveringThreshold }),
    setRecoveringSlot: (recoveringSlot: string) => set({ recoveringSlot }),
    setRecoveringSlotInitInfo: (recoveringSlotInitInfo: any) => set({ recoveringSlotInitInfo }),
    setIsRecovering: (isRecovering: boolean) => set({ isRecovering }),

    setEditingGuardians: (editingGuardians: string[]) => set({ editingGuardians }),
    setEditingGuardianNames: (editingGuardianNames: string[]) => set({ editingGuardianNames }),
    setEditingThreshold: (editingThreshold: number) => set({ editingThreshold }),
    setEditingGuardiansInfo: (editingGuardiansInfo: any) => set({ editingGuardiansInfo }),
    setCancelEditingGuardiansInfo: (cancelEditingGuardiansInfo: any) => set({ cancelEditingGuardiansInfo }),
    setIsEditing: (isEditing: boolean) => set({ isEditing }),
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
