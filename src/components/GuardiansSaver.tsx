import React, { useEffect, useState } from "react";
import Button from "./Button";
import InputWrapper from "./InputWrapper";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";

interface IProps {
    onSave: () => void;
}

const GuardiansSaver = ({ onSave }: IProps) => {
    const { downloadJsonFile, emailJsonFile, formatGuardianFile } = useTools();
    const { guardians } = useGlobalStore();
    const [email, setEmail] = useState<string>();
    const [downloading, setDownloading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
    }, [email]);

    const handleDownload = async () => {
        setDownloading(true);

        const walletAddress = await getLocalStorage("walletAddress");

        const jsonToSave = formatGuardianFile(walletAddress, guardians);

        downloadJsonFile(jsonToSave);

        setDownloading(false);

        onSave();
    };

    const handleEmailChange = (val: string) => {
        setEmail(val);
    };

    const handleSendEmail = async () => {
        if (!email) {
            return;
        }
        setSending(true);

        try {
            const walletAddress = await getLocalStorage("walletAddress");

            const jsonToSave = formatGuardianFile(walletAddress, guardians);

            const res: any = await emailJsonFile(jsonToSave, email);

            if (res.code === 200) {
                onSave();
            }
        } catch {
            // maybe toast error message?
        } finally {
            setSending(false);
        }
    };

    return (
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
    );
};

export default GuardiansSaver;
