import React, { useState } from "react";
import Button from "@src/components/Button";
import IconEnter from "@src/assets/enter.svg";
import IconLoading from "@src/assets/loading.gif";
import { Input } from "../Input";

interface SendEmailProps {
    emailLabel?: string;
    onVerified: () => void;
}

interface FormErrors {
    email: string;
    code: string;
}

export function SendEmail({ emailLabel, onVerified }: SendEmailProps) {
    const [email, setEmail] = useState<string>("");
    const [verifyCode, setVerifyCode] = useState<string>("");
    const [gapTime, setGapTime] = useState<any>(0);
    const [emailSending, setEmailSending] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [sendInterval, setSendInterval] = useState<any>(undefined);
    const [errors, setErrors] = useState<FormErrors>({
        email: "",
        code: "",
    });

    const checkParams = (): boolean => {
        let flag = true;

        // check email
        const res = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
            email,
        );
        console.log(res);
        if (!res) {
            setErrors((prev) => ({
                ...prev,
                email: "Not a valid email address",
            }));
            flag = false;
        }

        // check code
        if (emailSent && verifyCode.length !== 6) {
            setErrors((prev) => ({
                ...prev,
                code: "Not a valid verification code (6 digits)",
            }));
            flag = false;
        }

        return flag;
    };

    const doVerify = async () => {
        if (!checkParams()) {
            return;
        }

        // send some api request here

        onVerified();
    };
    const doSend = async () => {
        if (!checkParams()) {
            return;
        }
        setEmailSending(true);
        setTimeout(() => {
            setEmailSending(false);
            setEmailSent(true);
            setGapTime(60);
            const interval = setInterval(() => {
                setGapTime((prev: number) => {
                    if (prev === 0) {
                        clearInterval(sendInterval);
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000);
            setSendInterval(interval);
        }, 800);
    };

    return (
        <div className="form-control w-full">
            <div className="mb-2">
                <Input
                    label={emailLabel}
                    value={email}
                    placeholder="info@xxx.com"
                    onChange={(val) => {
                        setEmail(val);
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    error={errors.email}
                />
            </div>
            {emailSent ? (
                <>
                    <div className="mb-40 relative">
                        <Input
                            label="Enter verification code"
                            value={verifyCode}
                            onChange={(val) => {
                                setVerifyCode(val);
                                setErrors((prev) => ({ ...prev, code: "" }));
                            }}
                            error={errors.code}
                            verified={verifyCode.length === 6}
                        />

                        <div className="mt-4">
                            {gapTime > 0 ? (
                                <div className="">
                                    You can resend after{" "}
                                    <span className="text-blueDeep">
                                        {gapTime}
                                    </span>{" "}
                                    seconds.
                                </div>
                            ) : (
                                <a
                                    className="text-blueDeep cursor-pointer"
                                    onClick={doSend}
                                >
                                    Resend
                                </a>
                            )}
                        </div>
                    </div>
                    <img
                        src={IconEnter}
                        onClick={doVerify}
                        className="w-10 h-10 block mx-auto cursor-pointer fixed bottom-14 left-0 right-0"
                    />
                </>
            ) : (
                <Button
                    loading={emailSending}
                    classNames="font-normal btn-blue mt-2"
                    onClick={doSend}
                >
                    Send verification code
                </Button>
            )}
        </div>
    );
}
