import React from "react";
import StartPage from "@src/pages/Start";
import { Route, HashRouter, Routes } from "react-router-dom";
import LogoV2 from "@src/components/LogoV2";

export function Fullscreen() {
    // Renders the component tree
    return (
        <HashRouter>
            <div className="min-w-0 w-screen h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center">
                <LogoV2 classname="mt-130 mb-80" />
                <div className="max-w-5xl">
                    <Routes>
                        <Route path="/start" element={<StartPage />} />
                        <Route path="*" element={<StartPage />} />
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
}
