import React from "react";
import { Navbar } from "@src/components/Navbar";

import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import Actions from "./comp/Actions";

export function Wallet() {
    return (
        <>
            <Navbar />
            <AccountInfo
                account="0x6b5cf860506c6291711478F54123312066944B3"
                action="activate"
            />

            <Actions />

            <Operations />
        </>
    );
}
