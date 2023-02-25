/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 *
 * TODO: cache user's input in sessionStorage - single
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
    updateNameById: (idx: string, name: string) => void;
    updateAddressById: (idx: string, address: string) => void;
    updateErrorMsgById: (idx: string, msg: string) => void;
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
    updateNameById: (id, name) => {
        set(({ guardians }) => {
            guardians[getIndexById(guardians, id)].name = name;
        });
    },
    updateAddressById: (id, address) => {
        set(({ guardians }) => {
            guardians[getIndexById(guardians, id)].address = address;
        });
    },
    updateErrorMsgById: (id, errorMsg) => {
        set(({ guardians }) => {
            guardians[getIndexById(guardians, id)]["errorMsg"] = errorMsg;
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
