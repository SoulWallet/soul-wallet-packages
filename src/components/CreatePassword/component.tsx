import React, { useState } from "react";
import IconEnter from "@src/assets/enter.svg";
import useWallet from "@src/hooks/useWallet";
import useWalletContext from "@src/context/hooks/useWalletContext";
import KeyStore from "@src/lib/keystore";
import { Input } from "../Input";

const keyStore = KeyStore.getInstance();

interface CreatePasswordProps {
    onCreatedWalletAddress?: (
        address: string | null,
        eoaAddress: string | null,
    ) => void;
    onCreatedEoaAddress?: (address: string | null) => void;
    saveKey?: boolean;
}

interface ErrorProps {
    newPassword: string;
    confirmPassword: string;
}

const errorDefaultValues = {
    newPassword: "",
    confirmPassword: "",
};

export function CreatePassword({
    onCreatedWalletAddress,
    onCreatedEoaAddress,
    saveKey = false,
}: CreatePasswordProps) {
    const { calculateWalletAddress } = useWallet();
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
            // do create account
            console.log("before create new");
            const address = await keyStore.createNewAddress(
                newPassword,
                saveKey,
            );
            console.log("after create new");

            if (onCreatedEoaAddress) {
                onCreatedEoaAddress(address);
            }

            if (onCreatedWalletAddress) {
                const walletAddress: string = calculateWalletAddress(address);
                onCreatedWalletAddress(walletAddress, address);
            }
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
            <div className="mb-6">
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
                    onEnter={doCreate}
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
