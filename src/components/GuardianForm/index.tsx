import React from "react";
import GuardianInput from "./GuardianInput";
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";

export default function GuardianForm() {
    const guardians = useGuardianContext((s) => s.guardians);

    return (
        <div className="w-full flex flex-row flex-wrap justify-between gap-y-24">
            {guardians.map((item) => (
                <GuardianInput key={item.id} {...item} />
            ))}
        </div>
    );
}
