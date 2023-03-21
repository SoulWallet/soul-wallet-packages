import Button from "@src/components/Button";
import browser from "webextension-polyfill";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React from "react";

const DefaultSetting = () => {
    const dispatch = useStepDispatchContext();

    const handleNext = async (setDefault = true) => {
        await browser.storage.local.set({ shouldInject: setDefault });

        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.Completed,
        });
    };
    return (
        <div className="flex flex-col">
            <p className="tip-text mt-4 mb-8">Say Yes! You can change this setting easily on our home page.</p>

            <Button type="primary" onClick={() => handleNext(true)}>
                Yes
            </Button>

            <a className="skip-text mx-auto self-center my-5" onClick={() => handleNext(false)}>
                Skip for now
            </a>
        </div>
    );
};

export default DefaultSetting;
