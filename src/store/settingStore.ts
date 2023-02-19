import { create } from "zustand";
import config from "@src/config";
import { persist } from "zustand/middleware";

interface ISettingStore {
    bundlerUrl: string;
    isDefaultProvider: boolean;
}

export const useSettingStore = create<ISettingStore>()(
    persist(
        (set) => ({
            isDefaultProvider: true,
            bundlerUrl: config.bundlerUrl,
            setIsDefaultProvider: (isDefaultProvider: boolean) => {
                set({
                    isDefaultProvider,
                });
            },
            setBundlerUrl: (bundlerUrl: string) => {
                set({
                    bundlerUrl,
                });
            },
        }),
        {
            name: "setting-storage",
        },
    ),
);
