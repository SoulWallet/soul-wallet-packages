import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { RecoverWallet } from "@src/pages/RecoverWallet";
import { Wallet } from "@src/pages/Wallet";
import Send from "@src/pages/Send";
import SignPage from "@src/pages/SignPage";
import ActivateWallet from "@src/pages/ActivateWallet";
import useBrowser from "./hooks/useBrowser";
import { getLocalStorage } from "@src/lib/tools";
import Launch from "./pages/Launch";
import useKeystore from "./hooks/useKeystore";
import CreatePage from "./pages/Create";
import RecoverPage from "./pages/Recover";
import EditGuardians from "./pages/EditGuardians";

export default function PluginRouter() {
    const location = useLocation();
    const { goWebsite } = useBrowser();
    const navigate = useNavigate();
    const mode = new URLSearchParams(location.search).get("mode");
    const keystore = useKeystore();

    const checkUserState = async () => {
        const sessionPw = await keystore.getPassword();
        const recovering = await getLocalStorage("recovering");
        const isLocked = await keystore.checkLocked();
        const isSign = location.pathname === "/sign";

        if (sessionPw) {
            await keystore.unlock(sessionPw);
        }

        if (mode !== "web") {
            if (recovering) {
                goWebsite("/recover");
            } else if ((isLocked || sessionPw) && !isSign) {
                navigate("/wallet");
            } else if (!isSign) {
                goWebsite("/launch");
            }
        }
    };

    useEffect(() => {
        checkUserState();
    }, []);

    return (
        <div className={cn("bg-white text-base", mode !== "web" && "plugin-board")}>
            <Routes>
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/send/:tokenAddress" element={<Send />} />
                <Route path="/sign" element={<SignPage />} />
                <Route path="/activate-wallet" element={<ActivateWallet />} />
                <Route path="/recover-wallet" element={<RecoverWallet />} />
                <Route path="/launch" element={<Launch />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/recover" element={<RecoverPage />} />
                <Route path="/edit-guardians" element={<EditGuardians />} />
                <Route path="*" element={<Wallet />} />
            </Routes>
        </div>
    );
}
