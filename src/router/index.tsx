import React, { useEffect } from "react";
import cn from "classnames";
import { Routes, useLocation } from "react-router-dom";
import useBrowser from "../hooks/useBrowser";
import { Box } from "@chakra-ui/react";
import { getLocalStorage } from "@src/lib/tools";
import useKeyring from "../hooks/useKeyring";
import RouterV1 from "./v1";

export default function PluginRouter() {
    const location = useLocation();
    const { goWebsite, navigate } = useBrowser();
    const mode = new URLSearchParams(location.search).get("mode");
    const keystore = useKeyring();

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
        findRoute();
    }, []);

    // TODO, judge website as well

    return (
        <Box
            bg="appBg"
            fontSize={"16px"}
            w={mode === "web" ? "" : "360px"}
            h={mode === "web" ? "" : "600px"}
            overflow={"auto"}
            className="hide-scrollbar"
        >
            <Routes>{RouterV1}</Routes>
        </Box>
    );
}
