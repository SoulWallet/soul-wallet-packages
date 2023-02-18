import Button from "@src/components/Button";
import FileUploader from "@src/components/FileUploader";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import Modal from "@src/components/Modal";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";

const GuardiansInputting = () => {
    const formRef = useRef<IGuardianFormHandler>(null);
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

    const dispatch = useStepDispatchContext();
    const handleCheckGuardianAddresses = () => {
        // TODO: here
        // // 👇 mock logic, delete it
        // setShowVerificationModal(true);
        // setTimeout(() => {
        //     setShowVerificationModal(false);
        // }, 3000);

        // ! if check pass, then submit guardians to the global store
        formRef.current?.submit();
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
            <>
                <label className="mb-8">Import</label>
                <FileUploader />
            </>

            <div className="mt-72 6">
                <label className="mb-16">Manual</label>
                {/* TODO: pass init data from file parsing? */}
                <GuardianForm ref={formRef} />
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
