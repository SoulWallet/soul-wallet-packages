import Button from "@src/components/Button";
import FileUploader from "@src/components/FileUploader";
import GuardianForm from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { GuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianStoreReturnType, createGuardianStore } from "@src/store";
import React, { useRef, useState } from "react";

const GuardiansInputting = () => {
    const dispatch = useStepDispatchContext();
    const storeRef = useRef<GuardianStoreReturnType>();
    if (!storeRef.current) {
        // TODO: init guardians ? storeRef.current = createGuardianStore({ guardians: [] });
        storeRef.current = createGuardianStore();
    }

    const handleAskSignature = () => {
        // TODO: check legal?

        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.SignaturePending,
        });
    };
    return (
        <div>
            <div>
                <label className="mb-8">Import</label>
                <FileUploader />
            </div>

            <div className="mt-72 6">
                <label className="mb-16">Manual</label>
                <GuardianContext.Provider value={storeRef.current}>
                    <GuardianForm />
                </GuardianContext.Provider>
            </div>

            <Button type="primary" className="w-base mx-auto mt-103 mb-49" onClick={handleAskSignature}>
                Ask For Signature
            </Button>
        </div>
    );
};

export default GuardiansInputting;
