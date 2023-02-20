import Button from "@src/components/Button";
import GuardianForm from "@src/components/GuardianForm";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef } from "react";

export default function GuardiansSetting() {
    const dispatch = useStepDispatchContext();

    const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    return (
        <div>
            <p className="tip-text mt-6 mb-4  whitespace-pre-wrap">
                The Safe is a MultiSig account that is controlled by its signer keys. Please refer to the respective
                help centre
                <br />
                article to learn more about this.
            </p>

            <GuardianForm />

            <div className="flex flex-col items-center gap-4">
                <Button
                    className="mt-8"
                    type={"primary"}
                    disable={false}
                    onClick={() => handleJumpToTargetStep(CreateStepEn.SaveGuardianList)}
                >
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
