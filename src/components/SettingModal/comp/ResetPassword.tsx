import React, { useState } from "react";
import IconArrowBack from "@src/assets/arrow-left.svg";
import { Input } from "@src/components/Input";
import Button from "@src/components/Button";

interface IResetPassword {
    onChange: (index: number) => void;
}

export default function ResetPassword({ onChange }: IResetPassword) {
    const [originalPassword, setOriginalPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const doReset = () => {
        if (newPassword !== confirmPassword) {
            console.log("not match");
        }
    };

    return (
        <div className="px-6 pt-3 pb-8">
            <img
                src={IconArrowBack}
                className="cursor-pointer w-6 mb-2"
                onClick={() => onChange(0)}
            />

            <div className="text-black text-lg font-bold mb-3">
                Reset login password
            </div>
            <div className="flex flex-col gap-4">
                <Input
                    label="Original password"
                    labelColor="text-black"
                    value={originalPassword}
                    type="password"
                    onChange={setOriginalPassword}
                    error=""
                />

                <Input
                    label="New password"
                    labelColor="text-black"
                    value={newPassword}
                    type="password"
                    onChange={setNewPassword}
                    error=""
                />

                <Input
                    label="Confirm password"
                    labelColor="text-black"
                    value={confirmPassword}
                    type="password"
                    onChange={setConfirmPassword}
                    error=""
                />

                <Button onClick={doReset} classNames="btn-blue">
                    Confirm
                </Button>
            </div>
        </div>
    );
}
