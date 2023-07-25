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
    <div className="flex flex-col justify-center items-center">
      <div className="page-title text-center">
        Backup Guardians
      </div>
      <div className="tip-preview">
        <p className="tip-text mt-6 mb-6 whitespace-pre-wrap text-center">
          Make sure to save your list of guardians for social recovery. Choose at least one method below to keep this list safe.
        </p>
      </div>

      <GuardiansSaver onSave={handleSaved} />

      <Button className="w-base mt-14 mx-auto" type="primary" disabled={!hasSaved} onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
};

export default GuardiansSaving;
