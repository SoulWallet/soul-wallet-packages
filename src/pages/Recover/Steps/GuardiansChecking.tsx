import Button from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import ModalV2 from "@src/components/ModalV2";
import { TEMPORARY_GUARDIANS_STORAGE_KEY, getSessionStorageV2, removeSessionStorageV2 } from "@src/lib/tools";
import api from "@src/lib/api";
import config from "@src/config";
import useWallet from "@src/hooks/useWallet";

const GuardiansChecking = () => {
    const storage = getSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY);
    const temporaryGuardians = storage ? JSON.parse(storage) : undefined;
    const { initRecoverWallet } = useWallet();

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
        // TODO: once the guardians are submitted, clear the temporary guardians
        removeSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY);
    };

    const handleAskSignature = async () => {
        handleCheckGuardianAddresses();

        await initRecoverWallet("");

        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.SignaturePending,
        });
    };
    return (
        <div className="pt-6 flex flex-col">
            {/* TODO: pass init data from file parsing? */}
            <GuardianForm ref={formRef} guardians={temporaryGuardians} />

            <Button type="primary" className="w-base mx-auto my-6" onClick={handleAskSignature}>
                Ask For Signature
            </Button>

            <ModalV2 visible={showVerificationModal} id="verification-failed">
                <div className="flex flex-col items-center w-[480px] ">
                    <h1>Guardian addresses Verification failed</h1>
                    <img src={attentionIcon} alt="" className="w-16 h-16 my-10" />
                    <Button type="primary" onClick={handleCheckGuardianAddresses}>
                        Check again
                    </Button>
                </div>
            </ModalV2>
        </div>
    );
};

export default GuardiansChecking;
