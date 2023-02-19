import React, { ReactNode } from "react";
import LogoV2 from "./LogoV2";

export default function FullscreenContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-screen min-h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center py-130">
            <LogoV2 classname="justify-self-start" />
            <div className="max-w-5xl border-white rounded-24 progress-window-shadow px-16 pt-16 max-h-fit justify-self-center mt-70">
                {children}
            </div>
        </div>
    );
}
