import React, { useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import Button from "@src/components/Button";
import PageTitle from "@src/components/PageTitle";
import { useToast } from "@chakra-ui/react";
import FormInput from "@src/components/FormInput";
import { Navbar } from "@src/components/Navbar";
import { Box } from "@chakra-ui/react";

interface IResetPassword {
    onCancel: () => void;
}

export default function ResetPassword({ onCancel }: IResetPassword) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const keystore = useKeyring();
    const toast = useToast();

    const doConfirm = async () => {
        if (newPassword !== confirmPassword) {
            console.log("mismatch");
            toast({
                title: "Password not match",
                status: "error",
            });
            return;
        }
        try {
            await keystore.changePassword(currentPassword, newPassword);
            toast({
                title: "Password updated",
                status: "success",
            });
            onCancel();
        } catch (err) {
            toast({
                title: "Wrong password",
                status: "error",
            });
        }
    };

    return (
        <Box px="5" pt="6">
            <Navbar backUrl="wallet" />
            <PageTitle mb="6">Reset Password</PageTitle>
            <FormInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                isPassword={true}
            />
            <Box h="5" />
            <FormInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={setNewPassword}
                isPassword={true}
            />
            <Box h="2px" />
            <FormInput
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={setConfirmPassword}
                isPassword={true}
            />

            <Button onClick={doConfirm} mt="5" py="4" fontSize={"20px"} fontWeight={"800"} w="100%" type="primary">
                Reset
            </Button>
        </Box>
    );
}
