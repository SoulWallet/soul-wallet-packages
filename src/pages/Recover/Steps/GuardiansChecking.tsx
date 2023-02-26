import Button from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import ModalV2 from "@src/components/ModalV2";
import { TEMPORARY_GUARDIANS_STORAGE_KEY, getSessionStorageV2, removeSessionStorageV2 } from "@src/lib/tools";
import useWallet from "@src/hooks/useWallet";

interface IGuardianChecking {
    walletAddress: string;
    payToken: string;
}

const GuardiansChecking = ({ walletAddress, payToken }: IGuardianChecking) => {
    const { initRecoverWallet } = useWallet();
    const storage = getSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY);
    const temporaryGuardians = storage ? JSON.parse(storage) : undefined;

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
        // formRef.current?.submit();
        // TODO: once the guardians are submitted, clear the temporary guardians
    };

    const handleAskSignature = async () => {
        handleCheckGuardianAddresses();

        await initRecoverWallet(walletAddress, temporaryGuardians, payToken);

        removeSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY);

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
