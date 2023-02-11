import React from "react";
import IconActive from "../../assets/icons/switch-active.svg";
import IconInactive from "../../assets/icons/switch-inactive.svg";
import { ISwitchProps } from "@src/types/ISwitch";

export default function Switch({ checked, onChange }: ISwitchProps) {
    return (
        <img
            src={checked ? IconActive : IconInactive}
            className="cursor-pointer"
            onClick={() => onChange(!checked)}
        />
    );
}
