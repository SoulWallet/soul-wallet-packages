// import { create } from "zustand";
// import { createGuardianSlice, GuardianStore } from "./guardian";
// import { GuardianItem } from "@src/lib/type";

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
