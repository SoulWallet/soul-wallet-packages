import React from "react";
import { WalletContextProvider } from "@src/context/WalletContext";
import { HashRouter } from "react-router-dom";
import PluginRouter from "@src/router";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@src/styles/Theme";

export function Popup() {
    return (
        <ChakraProvider theme={Theme}>
            {/** TODO, register fonts here instead of app.css */}
            {/* <Fonts /> */}
            <HashRouter>
                <WalletContextProvider>
                    <PluginRouter />
                </WalletContextProvider>
            </HashRouter>
        </ChakraProvider>
    );
}
