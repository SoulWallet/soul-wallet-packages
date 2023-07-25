import React, { useState } from "react";
import { Input } from "@src/components/Input";
import useKeystore from "@src/hooks/useKeystore";
import Button from "@src/components/Button";
import PageTitle from "@src/components/PageTitle";
import { toast } from "material-react-toastify";

interface IResetPassword {
    onChange: (index: number) => void;
    onCancel: () => void;
}

export default function ResetPassword({ onChange, onCancel }: IResetPassword) {
    const [originalPassword, setOriginalPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const keystore = useKeystore();

    const doConfirm = async () => {
        if (newPassword !== confirmPassword) {
            console.log("mismatch");
            toast.error("Password not match");
            return;
        }
        try {
            await keystore.changePassword(originalPassword, newPassword);
            toast.success("Password updated");
            onChange(0);
            onCancel();
        } catch (err) {
            toast.error("Wrong password");
        }
    };

    return (
        <div className="px-6 pt-3 pb-8">
            <PageTitle>Reset login password</PageTitle>
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

                <Button onClick={doConfirm} type="primary" className="mt-1">
                    Confirm
                </Button>
            </div>
        </div>
    );
}
