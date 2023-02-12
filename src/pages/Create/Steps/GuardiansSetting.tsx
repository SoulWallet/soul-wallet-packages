import Button from "@src/components/Button";
import GuardianForm from "@src/components/GuardianForm";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { GuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianStoreReturnType, createGuardianStore } from "@src/store";
import React, { useRef } from "react";

export default function GuardiansSetting() {
    const dispatch = useStepDispatchContext();

    const storeRef = useRef<GuardianStoreReturnType>();
    if (!storeRef.current) {
        storeRef.current = createGuardianStore();
    }

    const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    return (
        <div>
            <p className="tip-text mt-22 mb-15">
                The Safe is a MultiSig account that is controlled by its signer keys. Please refer to the respective
                help centre article to learn more about this.
            </p>

            <GuardianContext.Provider value={storeRef.current}>
                <GuardianForm />
            </GuardianContext.Provider>

            <div className="flex flex-col items-center gap-15">
                <Button
                    className="mt-32"
                    type={"primary"}
                    disable={true}
                    onClick={() => handleJumpToTargetStep(CreateStepEn.SaveGuardianList)}
                >
                    Next
                </Button>

                <a className="ski-text" onClick={() => handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault)}>
                    Skip
                </a>
            </div>
        </div>
    );
}
