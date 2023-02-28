import Button from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useState } from "react";
import GuardiansSaver from "@src/components/GuardiansSaver";

const GuardiansSaving = () => {
    const [hasSaved, setHasSaved] = useState(false);

    const dispatch = useStepDispatchContext();

    const handleSaved = () => {
        setHasSaved(true);
    };

    const handleNext = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.SetSoulWalletAsDefault,
        });
    };

    return (
        <div className="flex flex-col pb-14">
            <p className="tip-text my-4">
                To finish up, remember to backup your Guardians list! You’ll need this file to start the wallet recovery
                process, so make sure you have the copy saved.
            </p>

            <GuardiansSaver onSave={handleSaved} />

            <Button className="w-base mt-14 mx-auto" type="primary" disabled={!hasSaved} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default GuardiansSaving;
