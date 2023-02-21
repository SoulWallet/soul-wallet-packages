import InputWrapper from "@src/components/InputWrapper";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";

interface IProps {
    nextStep?: number;
    onSubmit: (password: string) => void;
}

// TODO: 优化交互逻辑
export const PasswordSetter = ({ nextStep, onSubmit }: IProps) => {
    const dispatch = useStepDispatchContext();

    const [password, setPassword] = useState<string>("");
    const [confirmPwd, setConfirmPwd] = useState<string>();
    const [createPwdVisible, setCreatePwdVisible] = useState(false);
    const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);
    const [isPwdSame, setIsPwdSame] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState<string>();

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
        setIsPwdSame(!(password || confirmPwd) || password === confirmPwd);
    }, [password, confirmPwd]);

    return (
        <div className="w-base mt-4 flex flex-col gap-6">
            {/* TODO: 密码强度提醒 */}
            <InputWrapper
                label="Create password"
                placeholder="At least 9 characters"
                value={password}
                visible={createPwdVisible}
                toggleVisibility={() => setCreatePwdVisible((state) => !state)}
                errorMsg={passwordMessage}
                onChange={(val) => setPassword(val)}
            />

            <InputWrapper
                label="Confirm password"
                placeholder="Enter again"
                value={confirmPwd}
                visible={confirmPwdVisible}
                errorMsg={(password?.length ?? 0) < 9 || isPwdSame ? undefined : "Please enter the same password"}
                toggleVisibility={() => setConfirmPwdVisible((state) => !state)}
                onChange={(val) => setConfirmPwd(val)}
            />

            <Button className="mb-6" type={"primary"} disabled={!(password && isPwdSame)} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default PasswordSetter;
