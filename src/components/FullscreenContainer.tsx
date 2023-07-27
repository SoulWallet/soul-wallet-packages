import React, { ReactNode } from "react";
import Logo from "@src/components/web/Logo";

export default function FullscreenContainer({ children }: { children: ReactNode }) {
    return (
      <div className="w-full min-h-screen bg-white bg-web-bg bg-center bg-no-repeat flex flex-col items-center py-32 bg-[#F7F7F7]">
        <Logo />
        <div className="max-w-5xl border-white rounded-3xl progress-window-shadow px-4 pt-4 max-h-fit justify-self-center mt-4">
          {children}
        </div>
      </div>
    );
}
