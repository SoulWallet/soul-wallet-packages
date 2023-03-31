import React, { ReactNode } from "react";
import LogoV2 from "./LogoV2";

export default function FullscreenContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-full min-h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center py-32">
            <LogoV2 classname="justify-self-start" />
            <div className="max-w-5xl border-white rounded-3xl progress-window-shadow px-4 pt-4 max-h-fit justify-self-center mt-4">
                {children}
            </div>
        </div>
    );
}
