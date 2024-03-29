import React, { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import useBrowser from "../hooks/useBrowser";
import { Box } from "@chakra-ui/react";
import { getLocalStorage } from "@src/lib/tools";
import useKeyring from "../hooks/useKeyring";
import RouterV1 from "./v1";
import { useAddressStore } from "@src/store/address";
import { useGuardianStore } from "@src/store/guardian";

export default function PluginRouter() {
    const location = useLocation();
    const { goWebsite, navigate } = useBrowser();
    const mode = new URLSearchParams(location.search).get("mode");
    const keystore = useKeyring();
    const { addressList } = useAddressStore()
    const { isEditing, isRecovering } = useGuardianStore()
    console.log('guardians', isEditing, isRecovering)

    const findRoute = async () => {
        const sessionPw = await keystore.getPassword();
        const recovering = await getLocalStorage("recovering");
        const isLocked = await keystore.checkLocked();
        const isSign = location.pathname.includes("/sign");
        const isActivate = location.pathname.includes("/activate");

        if (sessionPw) {
            await keystore.unlock(sessionPw);
        }

        if (mode !== "web") {
            if (isActivate) {
                navigate("activate");
            } else if (recovering) {
                goWebsite("recover");
            } else if ((isLocked || sessionPw) && !isSign && addressList.length > 0) {
                navigate("wallet");
            } else if (!isSign) {
                goWebsite("launch");
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
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          }
        }}
      >
        <Routes>{RouterV1}</Routes>
      </Box>
    );
}
