/**
 * Use Soul Wallet Lib
 */

import config from "@src/config";
import { useSettingStore } from "@src/store/settingStore";
import useWalletContext from "@src/context/hooks/useWalletContext";

import { SoulWalletLib } from "soul-wallet-lib";

const soulWalletLib = new SoulWalletLib(config.contracts.create2Factory);

export default function useLib() {
    const { ethersProvider } = useWalletContext();
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);

    const bundler = new soulWalletLib.Bundler(
        config.contracts.entryPoint,
        ethersProvider,
        bundlerUrl,
    );

    return { bundler, soulWalletLib };
}
