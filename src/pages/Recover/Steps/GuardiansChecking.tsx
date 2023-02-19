import Button from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import Modal from "@src/components/Modal";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import { useGlobalStore } from "@src/store/global";

const GuardiansChecking = () => {
    const formRef = useRef<IGuardianFormHandler>(null);
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
    const { temporaryGuardians, clearTemporaryGuardians } = useGlobalStore();

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
        // TODO: once the guardians are submitted, clear the temporary guardians
        clearTemporaryGuardians();
    };

    const handleAskSignature = () => {
        handleCheckGuardianAddresses();

        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.SignaturePending,
        });
    };
    return (
        <div className="pt-22">
            {/* TODO: pass init data from file parsing? */}
            <GuardianForm ref={formRef} guardians={temporaryGuardians} />

            <Button type="primary" className="w-base mx-auto my-22" onClick={handleAskSignature}>
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

export default GuardiansChecking;
