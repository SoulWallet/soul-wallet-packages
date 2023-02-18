import React from "react";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import PasswordSetter from "@src/components/PasswordSetter";

export default function PasswordResetting() {
    const dispatch = useStepDispatchContext();

    const handleSubmitPassword = (pwd: string) => {
        //TODO: here
        console.log("user reset password: ", pwd);
    };

    return (
        <div className="pb-38">
            <PasswordSetter nextStep={RecoverStepEn.GuardiansInputting} onSubmit={handleSubmitPassword} />
        </div>
    );
}
