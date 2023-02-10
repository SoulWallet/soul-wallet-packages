import React, { ReactNode } from "react";
import LogoV2 from "./LogoV2";

export default function FullscreenContainer({ children }: { children: ReactNode }) {
    return (
        <div className="w-screen h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center">
            <LogoV2 classname="mt-130 mb-80" />
            <div className="max-w-5xl">{children}</div>
        </div>
    );
}
