import React from "react";
import useKeystore from "@src/hooks/useKeystore";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import PasswordSetter from "@src/components/PasswordSetter";

export default function PasswordResetting() {
    const keystore = useKeystore();

    const handleSubmitPassword = async (pwd: string) => {
        await keystore.createNewAddress(pwd, false);
    };

    return (
        <div className="pb-38">
            <PasswordSetter nextStep={RecoverStepEn.GuardiansImporting} onSubmit={handleSubmitPassword} />
        </div>
    );
}
