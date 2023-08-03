import { create } from "zustand";
import config from "@src/config";

interface ISettingStore {
    bundlerUrl: string;
}

export const useSettingStore = create<ISettingStore>()(
    (set) => ({
        // important TODO, move this under chain
        bundlerUrl: config.defaultBundlerUrl,
        setBundlerUrl: (bundlerUrl: string) => {
            set({
                bundlerUrl,
            });
        },
    }),
    // persist(
    //     (set) => ({
    //         // important TODO, move this under chain
    //         bundlerUrl: config.defaultBundlerUrl,
    //         setBundlerUrl: (bundlerUrl: string) => {
    //             set({
    //                 bundlerUrl,
    //             });
    //         },
    //     }),
    //     {
    //         name: "setting-storage",
    //     },
    // ),
);
