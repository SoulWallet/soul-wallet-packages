import React from "react";
import { CreateStepEn } from "@src/context/StepContext";
import PasswordSetter from "@src/components/PasswordSetter";

export default function PasswordSetting() {
    const handleSubmitPassword = (pwd: string) => {
        //TODO: here
        console.log("user set password: ", pwd);
    };

    return (
        <div className="pb-34">
            <PasswordSetter nextStep={CreateStepEn.SetupGuardians} onSubmit={handleSubmitPassword} />
        </div>
    );
}
