import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import cn from "classnames";
import KeyStore from "@src/lib/keystore";
import {
    HashRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigation,
    useSearchParams,
} from "react-router-dom";
import Welcome from "@src/pages/Welcome";
import { CreateWallet } from "@src/pages/CreateWallet";
import { RecoverWallet } from "@src/pages/RecoverWallet";
import { Wallet } from "@src/pages/Wallet";
import Send from "@src/pages/Send";
import Sign from "@src/pages/Sign";

import { getLocalStorage } from "@src/lib/tools";

const keyStore = KeyStore.getInstance();

export default function PluginRouter() {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<string>("");
    const location = useLocation();
    const mode = new URLSearchParams(location.search).get("mode");

    const checkUserState = async () => {
        const sessionPw = await keyStore.getPassword();
        const recovering = await getLocalStorage("recovering");

        if (sessionPw && !recovering) {
            await keyStore.unlock(sessionPw);
            setAccount(await keyStore.getAddress());
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUserState();

        if (!browser) {
            return;
        }
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    return (
        // <Router>
        <div
            className={cn(
                "bg-white text-base",
                mode !== "web" && "plugin-board",
            )}
        >
            <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/send/:tokenAddress" element={<Send />} />
                <Route path="/sign" element={<Sign />} />
                <Route path="/create-wallet" element={<CreateWallet />} />
                <Route path="/recover-wallet" element={<RecoverWallet />} />
                <Route path="*" element={<Wallet />} />
                {!loading && (
                    <Route
                        path="*"
                        element={account ? <Wallet /> : <Welcome />}
                    />
                )}
            </Routes>
        </div>
        // </Router>
    );
}
