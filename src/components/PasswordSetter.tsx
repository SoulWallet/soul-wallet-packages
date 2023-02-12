import InputWrapper from "@src/components/InputWrapper";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";

interface IProps {
    nextStep?: number;
    onSubmit: (pwd: string) => void;
}

// TODO: 优化交互逻辑
export const PasswordSetter = ({ nextStep, onSubmit }: IProps) => {
    const dispatch = useStepDispatchContext();

    const [pwd, setPwd] = useState<string>();
    const [confirmPwd, setConfirmPwd] = useState<string>();
    const [createPwdVisible, setCreatePwdVisible] = useState(false);
    const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);
    const [isPwdSame, setIsPwdSame] = useState(true);

    const handleNext = () => {
        pwd && onSubmit(pwd);

        nextStep &&
            dispatch({
                type: StepActionTypeEn.JumpToTargetStep,
                payload: nextStep,
            });
    };

    useEffect(() => {
        // 密码均不为空 且 全等
        setIsPwdSame(!(pwd || confirmPwd) || pwd === confirmPwd);
    }, [pwd, confirmPwd]);

    return (
        <div className="w-base mt-23 flex flex-col gap-24">
            <InputWrapper
                label="Create password"
                placeholder="At least 9 characters"
                value={pwd}
                visible={createPwdVisible}
                toggleVisibility={() => setCreatePwdVisible((state) => !state)}
                errorMsg={pwd && pwd?.length > 8 ? undefined : "Please set a password of at least 9 characters"}
                onChange={(val) => setPwd(val)}
            />

            <InputWrapper
                label="Confirm password"
                placeholder="Enter again"
                value={confirmPwd}
                visible={confirmPwdVisible}
                errorMsg={(pwd && pwd?.length < 9) || isPwdSame ? undefined : "Please enter the same password"}
                toggleVisibility={() => setConfirmPwdVisible((state) => !state)}
                onChange={(val) => setConfirmPwd(val)}
            />

            <Button className="mt-32" type={"primary"} disable={!(pwd && isPwdSame)} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default PasswordSetter;
