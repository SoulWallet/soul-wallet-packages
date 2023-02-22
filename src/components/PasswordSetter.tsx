import InputWrapper from "@src/components/InputWrapper";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface IProps {
    nextStep?: number;
    onSubmit: (password: string) => void;
}

export const PasswordSetter = ({ nextStep, onSubmit }: IProps) => {
    const dispatch = useStepDispatchContext();

    const [password, setPassword] = useState<string>("");
    const [confirmPwd, setConfirmPwd] = useState<string>();
    const [createPwdVisible, setCreatePwdVisible] = useState(false);
    const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);
    const [isPwdSame, setIsPwdSame] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState<string>();
    const [nextable, setNextable] = useState(false);

    const handleNext = () => {
        if ((password?.length ?? 0) < 9) {
            setPasswordMessage("Password must be at least 9 characters long");
            return;
        }
        password && onSubmit(password);

        nextStep &&
            dispatch({
                type: StepActionTypeEn.JumpToTargetStep,
                payload: nextStep,
            });
    };

    useEffect(() => {
        // 密码均不为空 且 全等
        const pwdSame = !(password || confirmPwd) || password === confirmPwd;
        setIsPwdSame(pwdSame);

        // 密码长度不小于9 且 密码相等
        setNextable((password?.length ?? 0) > 8 && pwdSame);
    }, [password, confirmPwd]);

    return (
        <div className="w-base mt-4 flex flex-col">
            <InputWrapper
                label="Create password"
                placeholder="At least 9 characters"
                value={password}
                visible={createPwdVisible}
                toggleVisibility={() => setCreatePwdVisible((prev: boolean) => !prev)}
                errorMsg={passwordMessage}
                onChange={(val) => setPassword(val)}
            />

            <PasswordStrengthBar className="mt-2" password={password} />

            <InputWrapper
                className="mt-3"
                label="Confirm password"
                placeholder="Enter again"
                value={confirmPwd}
                visible={confirmPwdVisible}
                errorMsg={(password?.length ?? 0) < 9 || isPwdSame ? undefined : "Please enter the same password"}
                toggleVisibility={() => setConfirmPwdVisible((prev: boolean) => !prev)}
                onChange={(val) => setConfirmPwd(val)}
            />

            <Button className="mb-6 mt-6" type={"primary"} disabled={!nextable} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default PasswordSetter;
