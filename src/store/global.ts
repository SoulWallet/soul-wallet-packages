import { GuardianItem } from "@src/lib/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
    temporaryGuardians?: GuardianItem[];
    guardians?: GuardianItem[];
    saveTemporaryGuardians: (guardians: GuardianItem[]) => void;
    clearTemporaryGuardians: () => void;
    updateFinalGuardians: (guardians: GuardianItem[]) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            clearTemporaryGuardians: () => set({ temporaryGuardians: undefined }),
            saveTemporaryGuardians: (guardians: GuardianItem[]) => set({ temporaryGuardians: guardians }),
            updateFinalGuardians: (guardians: GuardianItem[]) => set({ guardians }),
        }),
        {
            name: "global",
            // storage: createJSONStorage(() => sessionStorage), // cancel this comment if we need sessionStorage
        },
    ),
);
