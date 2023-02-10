import InputWrapper from "@src/components/InputWrapper";
import React, { useEffect, useState } from "react";
import Button from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";

// TODO: 优化交互逻辑
export default function PasswordSetting() {
    const dispatch = useStepDispatchContext();

    const [pwd, setPwd] = useState<string>();
    const [confirmPwd, setConfirmPwd] = useState<string>();
    const [createPwdVisible, setCreatePwdVisible] = useState(false);
    const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);
    const [isPwdSame, setIsPwdSame] = useState(true);

    useEffect(() => {
        // 密码均不为空 且 全等
        setIsPwdSame(!(pwd || confirmPwd) || pwd === confirmPwd);
    }, [pwd, confirmPwd]);

    const handleNext = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.SetupGuardians,
        });
    };

    return (
        <div className="pb-38">
            <div className="w-428 mt-23 flex flex-col gap-24">
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
            </div>

            <Button classNames="mt-32" type={"primary"} disable={!(pwd && isPwdSame)} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
}
