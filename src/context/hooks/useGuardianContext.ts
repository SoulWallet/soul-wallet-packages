import { GuardianState } from "@src/store/guardian";
import { GuardianStore } from "@src/store/guardian";
import { createContext, useContext } from "react";
import { useStore } from "zustand";

export const GuardianContext = createContext<GuardianState | null>(null);

type SelectorType<T> = (state: GuardianStore) => T;

export function useGuardianContext<T>(selector: SelectorType<T>, equalityFn?: (left: T, right: T) => boolean): T {
    const store = useContext(GuardianContext);
    if (!store) throw new Error("Provider for GuardianContext is missing, please check parent node.");
    return useStore(store, selector as SelectorType<T>, equalityFn);
}
