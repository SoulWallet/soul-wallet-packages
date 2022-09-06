import React, { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import KeyStore from "@src/lib/keystore";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Welcome } from "@src/pages/Welcome";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { CreateWallet } from "@src/pages/CreateWallet";
import { RecoverWallet } from "@src/pages/RecoverWallet";
import { Wallet } from "@src/pages/Wallet";
import GuardianDetail from "@src/pages/Guardian/detail";
import GuardianAdd from "@src/pages/Guardian/add";

const keyStore = KeyStore.getInstance();

export function Popup() {
    const [account, setAccount] = useState<string>("");

    const checkUserState = async () => {
        // check if user has account
        setAccount(await keyStore.getAddress());
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
        <div className="artboard phone-1 phone bg-white text-base">
            <Router>
                <Routes>
                    {/* <Route path="/" element={<Welcome />} /> */}
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/create-wallet" element={<CreateWallet />} />
                    <Route path="/recover-wallet" element={<RecoverWallet />} />
                    <Route path="/guardian/add" element={<GuardianAdd />} />
                    <Route
                        path="/guardian/:address"
                        element={<GuardianDetail />}
                    />
                    <Route path="*" element={account ? <Wallet /> : <Welcome />} />
                </Routes>
            </Router>
            <ToastContainer position="bottom-center" />
        </div>
    );
}
