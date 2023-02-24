import Button from "@src/components/Button";
import Dropdown, { OptionItem } from "@src/components/Dropdown";
import InputWrapper from "@src/components/InputWrapper";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import config from "@src/config";
import React, { useState } from "react";

// TODO: here
const NetworkOptions: OptionItem[] = [
    {
        label: "Ethereum",
        value: 1,
    },
    {
        label: "Goerli",
        value: 5,
    },
];

interface IRecoverStarter {
    onChange: (address: string) => void;
}

const RecoverStarter = ({ onChange }: IRecoverStarter) => {
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
        // TODO: add some check
        if (!address) {
            return;
        }
        onChange(address);
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.ResetPassword,
        });
    };

    return (
        <div className="pt-6 pb-8 flex flex-col gap-y-6">
            <InputWrapper
                label="Enter Wallet Address"
                value={address}
                onChange={handleChangeAddress}
                className="w-base"
            />
            <div></div>
            <Dropdown
                value={config.chainId}
                disabled={true}
                options={NetworkOptions}
                placeholder="Select Network"
                onChange={handleChangeNetwork}
            />

            <Button type="primary" disabled={!address || network === undefined} onClick={handleNext}>
                Next
            </Button>
        </div>
    );
};

export default RecoverStarter;
