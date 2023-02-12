import Button from "@src/components/Button";
import Dropdown, { OptionItem } from "@src/components/Dropdown";
import InputWrapper from "@src/components/InputWrapper";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useState } from "react";

// TODO: here
const NetworkOptions: OptionItem[] = [
    {
        label: "Ethereum",
        value: 0,
    },
    {
        label: "Bitcoin",
        value: 1,
    },
];

const RecoverStarter = () => {
    const dispatch = useStepDispatchContext();

    const [address, setAddress] = useState<string>();
    const [network, setNetwork] = useState<number>();

    const handleChangeAddress = (val: string) => {
        setAddress(val);
    };

    const handleChangeNetwork = (val: string | number) => {
        setNetwork(val as number);
    };

    const handleNext = () => {
        // TODO: here

        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.ResetPassword,
        });
    };

    return (
        <div className="pt-23 pb-38 flex flex-col gap-y-24">
            <InputWrapper
                label="Enter Wallet Address"
                value={address}
                onChange={handleChangeAddress}
                className="w-base"
            />
            <Dropdown options={NetworkOptions} placeholder="Select Network" onChange={handleChangeNetwork} />

            <Button type="primary" disable={!address || network === undefined} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default RecoverStarter;
