import React from "react";
import Dropdown from "@src/components/Dropdown";
import config from "@src/config";

const payTokens = config.assetsList
    .filter((item: any) => item.payable)
    .map((item: any) => ({ label: item.symbol, value: item.address }));

interface IPayTokenSelect {
    value: string;
    onChange: (val: string | number) => void;
}

export default function PayTokenSelect({ value, onChange }: IPayTokenSelect) {
    return <Dropdown label="Select Pay Token" value={value} options={payTokens} onChange={onChange} />;
}
