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
            const guardianList: GuardianItem[] = (await formRef.current?.submit()) as GuardianItem[];
            if (!guardianList || guardianList.length === 0) {
                return;
            }
            updateFinalGuardians(guardianList);

            const eoaAddress = await keystore.getAddress();

            const guardianAddress = guardianList.map((item: any) => item.address);

            console.log("before create", eoaAddress, guardianAddress);

            generateWalletAddress(eoaAddress, guardianAddress, true);
            handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
        } catch (err) {
            console.error(err);
        }
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
