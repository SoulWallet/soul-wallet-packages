import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface ISettingStore {
    globalShouldInject: boolean;
    shouldInjectList: string[];
    shouldNotInjectList: string[];
    setGlobalShouldInject: (shouldInject: boolean) => void;
    addShouldInject: (origin: string) => void;
    removeShouldInject: (origin: string) => void;
}

const createSettingSlice = immer<ISettingStore>((set, get) => ({
    globalShouldInject: true,
    shouldInjectList: [],
    shouldNotInjectList: [],
    setGlobalShouldInject: (shouldInject: boolean) => {
        set({
            globalShouldInject: shouldInject,
        });
    },
    addShouldInject: (origin: string) => {
        set((state) => {
            state.shouldInjectList.push(origin);
            const removeIndex = state.shouldInjectList.indexOf(origin);
            if (removeIndex > -1) {
                state.shouldNotInjectList.splice(removeIndex, 1);
            }
        });
    },
    removeShouldInject: (origin: string) => {
        set((state) => {
            state.shouldNotInjectList.push(origin);
            const removeIndex = state.shouldInjectList.indexOf(origin);
            if (removeIndex > -1) {
                state.shouldInjectList.splice(removeIndex, 1);
            }
        });
    },
}));

export const useSettingStore = create<ISettingStore>()(
    persist((...set) => ({ ...createSettingSlice(...set) }), {
        name: "setting-storage",
    }),
);
