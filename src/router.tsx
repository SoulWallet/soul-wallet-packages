import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import KeyStore from "@src/lib/keystore";
import {
    HashRouter as Router,
    Routes,
    Route,
    // useLocation,
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
    // const location = useLocation();

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
        <Router>
            <div className="artboard phone-1 bg-white text-base flex flex-col mx-auto">
                <Routes>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/send/:tokenAddress" element={<Send />} />
                    <Route path="/sign" element={<Sign />} />
                    <Route path="/create-wallet" element={<CreateWallet />} />
                    <Route path="/recover-wallet" element={<RecoverWallet />} />
                    {!loading && (
                        <Route
                            path="*"
                            element={account ? <Wallet /> : <Welcome />}
                        />
                    )}
                </Routes>
            </div>
        </Router>
    );
}
