/**
 * Use Soul Wallet Lib
 */

import {useMemo} from 'react'
import config from "@src/config";
import { useSettingStore } from "@src/store/settingStore";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { SoulWalletLib } from "soul-wallet-lib";

const soulWalletLib = new SoulWalletLib(config.contracts.create2Factory);

export default function useLib() {
    const { ethersProvider } = useWalletContext();
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);

    const bundler = useMemo(()=>{
        if(!ethersProvider || !bundlerUrl){
            return
        }
        console.log('ffff',bundlerUrl )
        return new soulWalletLib.Bundler(config.contracts.entryPoint, ethersProvider, bundlerUrl);
    }, [bundlerUrl, ethersProvider])

    return { bundler, soulWalletLib };
}
