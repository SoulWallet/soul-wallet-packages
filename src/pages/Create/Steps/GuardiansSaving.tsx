import Button from "@src/components/Button";
import InputWrapper from "@src/components/InputWrapper";
import useTools from "@src/hooks/useTools";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useState, useEffect } from "react";
import { getLocalStorage, validateEmail } from "@src/lib/tools";

const GuardiansSaving = () => {
    const { downloadJsonFile, emailJsonFile, formatGuardianFile } = useTools();
    const { guardians } = useGlobalStore();
    const [email, setEmail] = useState<string>();
    const [hasSaved, setHasSaved] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const { walletAddress } = useWalletContext();

    const dispatch = useStepDispatchContext();

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    const handleDownload = async () => {
        setDownloading(true);

        const walletAddress = await getLocalStorage("walletAddress");

        const jsonToSave = formatGuardianFile(walletAddress, guardians);

        downloadJsonFile(jsonToSave);

        setDownloading(false);
        setHasSaved(true);
    };

    const handleEmailChange = (val: string) => {
        setEmail(val);
    };

    const handleSendEmail = async () => {
        if (!email) {
            return;
        }
        setSending(true);

        const walletAddress = await getLocalStorage("walletAddress");

        const jsonToSave = formatGuardianFile(walletAddress, guardians);

        await emailJsonFile(jsonToSave, email);

        setSending(false);
        setHasSaved(true);
    };

    const handleNext = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.SetSoulWalletAsDefault,
        });
    };

    return (
        <div className="flex flex-col pb-14">
            <p className="tip-text my-4">
                To finish up, remember to backup your Guardians list! You’ll need this file to start the wallet recovery
                process, so make sure you have the copy saved.
            </p>

            <div className="flex flex-row items-end">
                <Button type="default" onClick={handleDownload} className="w-base" loading={downloading}>
                    Download
                </Button>

                <span className="mx-7 mb-3 text-base text-black">or</span>

                <InputWrapper
                    className="w-base"
                    label={"Back up via Email"}
                    value={email}
                    errorMsg={email && !isEmailValid ? "Please enter a valid email address." : undefined}
                    onChange={handleEmailChange}
                    buttonText="Send"
                    buttonDisabled={!isEmailValid}
                    buttonLoading={sending}
                    onClick={handleSendEmail}
                />
            </div>

            <Button className="w-base mt-14 mx-auto" type="primary" disabled={!hasSaved} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default GuardiansSaving;
