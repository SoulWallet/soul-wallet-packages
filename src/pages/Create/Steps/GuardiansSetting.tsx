import Button from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef } from "react";

export default function GuardiansSetting() {
    const dispatch = useStepDispatchContext();
    const formRef = useRef<IGuardianFormHandler>(null);

    const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    const handleNext = () => {
        handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
        formRef.current?.submit();
    };

    return (
        <div>
            <p className="tip-text mt-6 mb-4  whitespace-pre-wrap">
                The Safe is a MultiSig account that is controlled by its signer keys. Please refer to the respective
                help centre
                <br />
                article to learn more about this.
            </p>

            <GuardianForm ref={formRef} />

            <div className="flex flex-col items-center gap-4">
                <Button className="mt-8 w-base" type={"primary"} disabled={false} onClick={handleNext}>
                    Next
                </Button>

                <a
                    className="skip-text mb-8"
                    onClick={() => handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault)}
                >
                    Skip
                </a>
            </div>
        </div>
    );
}
