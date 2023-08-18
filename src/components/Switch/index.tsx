import React from "react";
import { Switch as CSwitch } from "@chakra-ui/react";
import { ISwitchProps } from "@src/types/ISwitch";

export default function Switch({ checked, onChange, ...restProps }: ISwitchProps) {
    return (
        <CSwitch
            isChecked={checked}
            size="lg"
            colorScheme="green"
            onChange={(e) => onChange(e.target.checked)}
            {...restProps}
        />
    );
}
