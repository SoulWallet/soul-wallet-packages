import React from "react";
import { CreateStepEn } from "@src/context/StepContext";
import useKeystore from "@src/hooks/useKeystore";
import useWalletContext from "@src/context/hooks/useWalletContext";
import PasswordSetter from "@src/components/PasswordSetter";

export default function PasswordSetting() {
    const keystore = useKeystore();
    const { getAccount } = useWalletContext();

    const handleSubmitPassword = async (pwd: string) => {
        await keystore.createNewAddress(pwd, true);
        getAccount();
    };

    return (
        <div className="pb-34">
            <PasswordSetter nextStep={CreateStepEn.SetupGuardians} onSubmit={handleSubmitPassword} />
        </div>
    );
}
