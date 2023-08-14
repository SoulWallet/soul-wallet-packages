import React from "react";
import { WalletContextProvider } from "@src/context/WalletContext";
import MessageContext from "@src/context/MessageContext";
import { HashRouter } from "react-router-dom";
import PluginRouter from "@src/router";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@src/styles/Theme";

export function Popup() {
    return (
        <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { duration: 1000 } }}>
            {/** TODO, register fonts here instead of app.css */}
            {/* <Fonts /> */}
            <HashRouter>
                <WalletContextProvider>
                    {/* <MessageContext> */}
                    <PluginRouter />
                    {/* </MessageContext> */}
                </WalletContextProvider>
            </HashRouter>
        </ChakraProvider>
    );
}
