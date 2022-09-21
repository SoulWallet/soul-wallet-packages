import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@src/components/Navbar";

import AccountInfo from "@src/components/AccountInfo";

export default function GuardianDetail() {
    const params = useParams();
    const address = params.address;

    return (
        <>
            <Navbar backUrl="/wallet" />
            <AccountInfo account={address || ""} action="remove" />
        </>
    );
}
