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
            // important TODO, move this under chain
            bundlerUrl: config.defaultBundlerUrl,
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
