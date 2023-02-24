import React from "react";
import { CreateStepEn } from "@src/context/StepContext";
import useKeystore from "@src/hooks/useKeystore";
import PasswordSetter from "@src/components/PasswordSetter";

export default function PasswordSetting() {
    const keystore = useKeystore();

    const handleSubmitPassword = async (pwd: string) => {
        await keystore.createNewAddress(pwd, true);
    };

    return (
        <div className="pb-34">
            <PasswordSetter nextStep={CreateStepEn.SetupGuardians} onSubmit={handleSubmitPassword} />
        </div>
    );
}
