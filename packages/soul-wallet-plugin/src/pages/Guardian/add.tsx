import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@src/components/Navbar";
import AddGuardians from "@src/components/AddGuardians";

export default function GuardianDetail() {
    const params = useParams();
    const address = params.address;

    return (
        <>
            <Navbar backUrl="/wallet" />
            <AddGuardians />
        </>
    );
}
