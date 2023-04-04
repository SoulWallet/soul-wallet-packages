import Button from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef } from "react";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";

export default function GuardiansSetting() {
    const dispatch = useStepDispatchContext();
    const keystore = useKeystore();
    const { generateWalletAddress } = useWallet();
    const { updateFinalGuardians } = useGlobalStore();
    const formRef = useRef<IGuardianFormHandler>(null);

    const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    const handleNext = async () => {
        try {
            const guardianList = (await formRef.current?.submit()) as GuardianItem[];
            if (guardianList?.length === 0) {
                return;
            }
            updateFinalGuardians(guardianList);

            const eoaAddress = await keystore.getAddress();

            const guardianAddress = guardianList.map((item) => item.address);

            generateWalletAddress(eoaAddress, guardianAddress, true);

            handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSkip = async () => {
        updateFinalGuardians([]);
        const eoaAddress = await keystore.getAddress();
        generateWalletAddress(eoaAddress, [], true);
        handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault);
    };

    return (
        <div>
            <p className="tip-text mt-6 mb-4  whitespace-pre-wrap">
                Guardians are a list of Ethereum wallet addresses that can help you recover your wallet.
            </p>

            <GuardianForm ref={formRef} />

            <div className="flex flex-col items-center gap-4">
                <Button className="mt-6 w-base" type={"primary"} disabled={false} onClick={handleNext}>
                    Next
                </Button>

                <a className="skip-text mb-8" onClick={handleSkip}>
                    Skip
                </a>
            </div>
        </div>
    );
}
