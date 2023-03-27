import React from "react";
import LogoLoading from "@src/assets/logo-loading.gif";

export default function Loading() {
    return (
        <div className="bg-white text-base plugin-board">
            <img src={LogoLoading} />
        </div>
    );
}
