import React, { useState } from "react";
import IconEnter from "@src/assets/enter.svg";
import { Input } from "../Input";

interface CreatePasswordProps {
    onCreated: () => void;
}

interface ErrorProps {
    newPassword: string;
    confirmPassword: string;
}

const errorDefaultValues = {
    newPassword: "",
    confirmPassword: "",
};

export function CreatePassword({ onCreated }: CreatePasswordProps) {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<ErrorProps>(errorDefaultValues);

    const checkParams = () => {
        let flag = true;

        if (!newPassword) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "Please enter new password",
            }));
            flag = false;
        }
        if (!confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Please confirm the password",
            }));
            flag = false;
        }
        if (newPassword !== confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Password not match",
            }));
            flag = false;
        }
        return flag;
    };

    const doCreate = async () => {
        // clear previous errors
        setErrors(errorDefaultValues);
        if (checkParams()) {
            onCreated();
        }
    };

    return (
        <div className="form-control w-full">
            <div className="mb-2">
                <Input
                    type="password"
                    label="New password"
                    error={errors.newPassword}
                    value={newPassword}
                    onChange={(val) => {
                        setNewPassword(val);
                        setErrors((prev) => ({
                            newPassword: "",
                            confirmPassword: "",
                        }));
                    }}
                />
            </div>
            <div className="mb-10">
                <Input
                    type="password"
                    label="Confirm password"
                    verified={
                        newPassword !== "" &&
                        confirmPassword !== "" &&
                        newPassword === confirmPassword
                    }
                    error={errors.confirmPassword}
                    value={confirmPassword}
                    onChange={(val) => {
                        setConfirmPassword(val);
                        setErrors((prev) => ({
                            newPassword: "",
                            confirmPassword: "",
                        }));
                    }}
                />
            </div>

            <img
                src={IconEnter}
                onClick={doCreate}
                className="w-10 h-10 block mx-auto cursor-pointer fixed bottom-14 left-0 right-0"
            />
        </div>
    );
}
