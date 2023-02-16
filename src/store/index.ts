import { create } from "zustand";
import { createGuardianSlice, GuardianStore } from "./guardian";
import { GuardianItem } from "@src/lib/type";

// TODO: global guardian store
// !!! Global Level Context is Over-Designed for now. Once there is more than 1 slice, activate following code.
// export type GlobalStore = GuardianStore; // & XXSlice; // add other slice type
// export type GlobalStoreReturnType = ReturnType<typeof createGlobalStore>;

// type InitialProps = {
//     guardians: GuardianItem[];
// };

// export const createGlobalStore = (initProps?: Partial<InitialProps>) => {
//     return create<GlobalStore>()((...a) => ({
//         ...createGuardianSlice(...a), // add other store slice
//         ...initProps,
//     }));
// };

export type GuardianStoreReturnType = ReturnType<typeof createGuardianStore>;

type GuardianStoreInitialProps = {
    guardians: GuardianItem[];
};

export const createGuardianStore = (initProps?: GuardianStoreInitialProps) =>
    create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

export const useGuardianStore = create<GuardianStore>()((...a) => ({
    ...createGuardianSlice(...a), // add other store slice
}));
