import Button from "@src/components/Button";
import FileUploader from "@src/components/FileUploader";
import GuardianForm from "@src/components/GuardianForm";
import Modal from "@src/components/Modal";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { GuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianStoreReturnType, createGuardianStore } from "@src/store";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";

const GuardiansInputting = () => {
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

    const dispatch = useStepDispatchContext();
    const storeRef = useRef<GuardianStoreReturnType>();
    if (!storeRef.current) {
        // TODO: init guardians ? storeRef.current = createGuardianStore({ guardians});
        storeRef.current = createGuardianStore();
    }

    const handleCheckGuardianAddresses = () => {
        // TODO: here
        // // 👇 mock logic, delete it
        // setShowVerificationModal(true);
        // setTimeout(() => {
        //     setShowVerificationModal(false);
        // }, 3000);
    };

    const handleAskSignature = () => {
        handleCheckGuardianAddresses();

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

            <Modal visible={showVerificationModal} id="verification-failed">
                <div className="flex flex-col items-center w-480 ">
                    <h1>Guardian addresses Verification failed</h1>
                    <img src={attentionIcon} alt="" className="w-64 h-64 my-40" />
                    <Button type="primary" onClick={handleCheckGuardianAddresses}>
                        Check again
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default GuardiansInputting;
