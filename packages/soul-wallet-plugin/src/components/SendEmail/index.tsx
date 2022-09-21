import React, { useState, useEffect } from "react";
import api from "@src/lib/api";
import Button from "@src/components/Button";
import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
} from "@src/lib/tools";
import IconEnter from "@src/assets/enter.svg";
import { Input } from "../Input";

interface SendEmailProps {
    emailLabel?: string;
    cachedEmail?: string;
    onReceiveCode: (email: string, code: string) => void;
}

interface FormErrors {
    email: string;
    code: string;
}

export function SendEmail({
    emailLabel,
    cachedEmail,
    onReceiveCode,
}: SendEmailProps) {
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

    const checkParams = (skipCheckNode = false): boolean => {
        let flag = true;

        // check email
        const res = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
            email,
        );
        if (!res) {
            setErrors((prev) => ({
                ...prev,
                email: "Not a valid email address",
            }));
            flag = false;
        }

        // check code
        if (!skipCheckNode && verifyCode.length !== 6) {
            setErrors((prev) => ({
                ...prev,
                code: "Not a valid verification code (6 digits)",
            }));
            flag = false;
        }

        return flag;
    };

    const startCountdown = async () => {
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
    };

    const doVerify = async () => {
        if (!checkParams()) {
            return;
        }
        onReceiveCode(email, verifyCode);
        await removeLocalStorage("cachedEmail");
    };

    const doSend = async () => {
        if (!checkParams(true)) {
            return;
        }
        await setLocalStorage("cachedEmail", email);
        setEmailSending(true);
        const res: any = await api.account.verifyEmail({
            email,
        });
        if (res.code === 200) {
            setEmailSending(false);
            setEmailSent(true);
            startCountdown();
        }
    };

    useEffect(() => {
        if (!cachedEmail) {
            return;
        }
        setEmail(cachedEmail);
        setEmailSent(true);
    }, [cachedEmail]);

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
                            ExtraButton={
                                <>
                                    {gapTime > 0 ? (
                                        <span className="text-[rgba(0,0,0,.2)] bg-gray30 py-[5px] px-3 text-xs rounded-xl">
                                            {gapTime}s
                                        </span>
                                    ) : (
                                        <a
                                            className="bg-blue py-[5px] px-3 text-white text-xs rounded-xl cursor-pointer"
                                            onClick={doSend}
                                        >
                                            Resend
                                        </a>
                                    )}
                                </>
                            }
                        />
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
