import React from "react";
import { Navbar } from "@src/components/Navbar";
import AddGuardians from "@src/components/AddGuardians";

export default function GuardianAdd() {
    return (
        <>
            <Navbar backUrl="/wallet" />
            <AddGuardians />
        </>
    );
}
