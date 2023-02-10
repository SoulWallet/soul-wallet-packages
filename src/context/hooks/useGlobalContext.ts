// !!! Global Level Context is Over-Designed for now. Once there is more than 1 slice, activate following code.
// import { GlobalStore, GlobalStoreReturnType } from "@src/store";
// import { createContext, useContext } from "react";
// import { useStore } from "zustand";

// export const GlobalContext = createContext<GlobalStoreReturnType | null>(null);

// export function useGlobalContext<T>(
//     selector: (state: GlobalStore) => T,
//     equalityFn?: (left: T, right: T) => boolean,
// ): T {
//     const store = useContext(GlobalContext);
//     if (!store) throw new Error("Provider for GlobalContext is missing, please check parent node.");
//     return useStore(store, selector, equalityFn);
// }
