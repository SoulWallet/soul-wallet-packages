import React, { ReactNode } from "react";
import LogoV2 from "./LogoV2";

export default function FullscreenContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-screen min-h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center">
            <LogoV2 classname="mt-130 mb-80" />
            <div className="max-w-5xl border-white rounded-24 progress-window-shadow px-16 pt-16 mb-196">
                {children}
            </div>
        </div>
    );
}
