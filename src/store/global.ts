import { GuardianItem } from "@src/lib/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
    guardians?: GuardianItem[];
    updateFinalGuardians: (guardians: GuardianItem[]) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            updateFinalGuardians: (guardians: GuardianItem[]) => set({ guardians }),
        }),
        {
            name: "global",
        },
    ),
);
