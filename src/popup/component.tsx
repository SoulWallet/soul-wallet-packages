import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import KeyStore from "@src/lib/keystore";
// import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "@src/pages/Welcome";
import { WalletContextProvider } from "@src/context/WalletContext";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { CreateWallet } from "@src/pages/CreateWallet";
import { RecoverWallet } from "@src/pages/RecoverWallet";
import { Wallet } from "@src/pages/Wallet";
import { getLocalStorage } from "@src/lib/tools";
import Send from "@src/pages/Send";
import Sign from "@src/pages/Sign";
import StartPage from "@src/pages/Start";

const keyStore = KeyStore.getInstance();

export function Popup() {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<string>("");

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

    // Renders the component tree
    return (
        <div className="  ">
            <WalletContextProvider>
                <Router>
                    <div className="artboard phone-1 bg-white text-base flex flex-col mx-auto">
                        <Routes>
                            <Route path="/welcome" element={<Welcome />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route
                                path="/send/:tokenAddress"
                                element={<Send />}
                            />
                            <Route path="/sign" element={<Sign />} />
                            <Route
                                path="/create-wallet"
                                element={<CreateWallet />}
                            />
                            <Route
                                path="/recover-wallet"
                                element={<RecoverWallet />}
                            />
                            {!loading && (
                                <Route
                                    path="*"
                                    element={account ? <Wallet /> : <Welcome />}
                                />
                            )}

                            {/* <Route path="/start" element={<StartPage />} /> */}
                        </Routes>
                    </div>
                </Router>
            </WalletContextProvider>
            <ToastContainer position="bottom-center" />
        </div>
    );
}
