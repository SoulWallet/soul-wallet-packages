/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 */
import { GuardianItem } from "@src/lib/type";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import { create } from "zustand";

const DEFAULT_GUARDIAN_NUMBER = 3; // 默认guardian数
export const MAX_GUARDIAN_NUMBER = 15; // 最大guardian数
export const MIN_GUARDIAN_NUMBER = 1; // 最大guardian数

const EMPTY_GUARDIAN = {
    name: "",
    address: "",
};

const getIndexById = (guardians: GuardianItem[], id: string) => {
    return guardians.findIndex((item: GuardianItem) => item.id === id);
};

export interface GuardianStore {
    guardians: GuardianItem[];
    addGuardian: (guardian?: GuardianItem) => void;
    removeGuardian: (idx: string) => void;
    updateNameByIndex: (idx: string, name: string) => void;
    updateAddressByIndex: (idx: string, address: string) => void;
}

const createGuardianSlice = immer<GuardianStore>((set) => ({
    guardians: Array(DEFAULT_GUARDIAN_NUMBER)
        .fill(EMPTY_GUARDIAN)
        .map((item) => {
            return { ...item, id: nanoid() };
        }),
    addGuardian: (guardian) =>
        set(({ guardians }) => {
            guardians.push(
                guardian ?? {
                    name: "",
                    address: "",
                    id: nanoid(),
                },
            );
        }),
    removeGuardian: (id) => {
        set(({ guardians }) => {
            guardians.splice(getIndexById(guardians, id), 1);
        });
    },
    updateNameByIndex: (id, name) => {
        set(({ guardians }) => {
            guardians[getIndexById(guardians, id)].name = name;
        });
    },
    updateAddressByIndex: (id, address) => {
        set(({ guardians }) => {
            guardians[getIndexById(guardians, id)].address = address;
        });
    },
}));

export type GuardianState = ReturnType<typeof createGuardianStore>;

type GuardianStoreInitialProps = {
    guardians: GuardianItem[];
};

export const createGuardianStore = (initProps?: GuardianStoreInitialProps) =>
    create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

// export const useGuardianStore = create<GuardianStore>()((...a) => ({
//     ...createGuardianSlice(...a), // add other store slice
// }));
