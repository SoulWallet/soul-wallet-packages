import React from "react";
import { Navbar } from "@src/components/Navbar";
import SendAssets from "@src/components/SendAssets";

export default function Send() {
    return (
        <>
            <Navbar backUrl="/wallet" />
            <SendAssets />
        </>
    );
}
