import Button from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React from "react";

const DefaultSetting = () => {
    const dispatch = useStepDispatchContext();

    const handleNext = (setDefault: boolean) => {
        if (setDefault) {
        } else {
        }
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.Completed,
        });
    };
    return (
        <div className="flex flex-col">
            <p className="tip-text mt-9 mb-33">
                Say Yes! <br />
                You can change this setting easily on our home page.
            </p>

            <Button type="primary" onClick={() => handleNext(true)}>
                Yes
            </Button>

            <a className="skip-text mx-auto self-center mt-19 mb-38" onClick={() => handleNext(false)}>
                Skip for now
            </a>
        </div>
    );
};

export default DefaultSetting;
