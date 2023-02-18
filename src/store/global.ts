import { GuardianItem } from "@src/lib/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
    guardians: GuardianItem[];
    updateGuardians: (guardians: GuardianItem[]) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            guardians: [],
            updateGuardians: (guardians: GuardianItem[]) => set({ guardians }),
        }),
        {
            name: "global",
            // storage: createJSONStorage(() => sessionStorage), // cancel this comment if we need sessionStorage
        },
    ),
);
