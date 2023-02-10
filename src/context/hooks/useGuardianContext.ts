import { GuardianStoreReturnType } from "@src/store";
import { GuardianStore } from "@src/store/guardian";
import { createContext, useContext } from "react";
import { useStore } from "zustand";

export const GuardianContext = createContext<GuardianStoreReturnType | null>(null);

export function useGuardianContext<T>(
    selector: (state: GuardianStore) => T,
    equalityFn?: (left: T, right: T) => boolean,
): T {
    const store = useContext(GuardianContext);
    if (!store) throw new Error("Provider for GuardianContext is missing, please check parent node.");
    return useStore(store, selector, equalityFn);
}
