import React from "react";
import { WalletContextProvider } from "@src/context/WalletContext";
import { ToastContainer } from "material-react-toastify";
import { HashRouter } from "react-router-dom";
import PluginRouter from "@src/router";
import { ChakraProvider } from "@chakra-ui/react";
import "material-react-toastify/dist/ReactToastify.css";

export function Popup() {
    return (
        <ChakraProvider>
            <HashRouter>
                <WalletContextProvider>
                    <PluginRouter />
                </WalletContextProvider>
            </HashRouter>

            <ToastContainer position="bottom-center" />
        </ChakraProvider>
    );
}
