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
        // <div
        //     onClick={() => onChange(!checked)}
        //     className={cn(
        //         "rounded-xl flex p-[2px] cursor-pointer w-[42px] h-6",
        //         checked ? "bg-blue justify-end" : "bg-[#999]",
        //     )}
        // >
        //     <div className="w-5 h-5 rounded-full switch-circle-shadow bg-white" />
        // </div>
    );
}
