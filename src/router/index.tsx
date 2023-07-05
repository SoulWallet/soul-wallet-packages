import React, { useEffect } from "react";
import cn from "classnames";
import { Routes, useLocation } from "react-router-dom";
import useBrowser from "../hooks/useBrowser";
import { getLocalStorage } from "@src/lib/tools";
import useKeystore from "../hooks/useKeystore";
import RouterV1 from "./v1";

export default function PluginRouter() {
    const location = useLocation();
    const { goWebsite, navigate } = useBrowser();
    const mode = new URLSearchParams(location.search).get("mode");
    const keystore = useKeystore();

    const findRoute = async () => {
        const sessionPw = await keystore.getPassword();
        const recovering = await getLocalStorage("recovering");
        const isLocked = await keystore.checkLocked();
        const isSign = location.pathname.includes("/sign");
        const isActivate = location.pathname.includes("/activate-wallet");

        if (sessionPw) {
            await keystore.unlock(sessionPw);
        }

        if (mode !== "web") {
            if (isActivate) {
                navigate("activate-wallet");
            } else if (recovering) {
                goWebsite("/v1/recover");
            } else if ((isLocked || sessionPw) && !isSign) {
                navigate("wallet");
            } else if (!isSign) {
                goWebsite("/v1/launch");
            }
        }
    };

    useEffect(() => {
        navigate("passkey");
        // findRoute();
    }, []);

    return (
        <div className={cn("bg-white text-base", mode !== "web" && "plugin-board")}>
            <Routes>{RouterV1}</Routes>
        </div>
    );
}
