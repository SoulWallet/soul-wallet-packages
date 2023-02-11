import React, { useState } from "react";
import Switch from "../Switch";
import IconInfo from "../../assets/icons/info.svg";
import IconHelp from "../../assets/icons/help.svg";

export default function Footer() {
    const [enabled, setEnabled] = useState<boolean>(false);
    return (
        <div className="px-6 py-3 flex items-center justify-between absolute bottom-0 left-0 right-0 footer-shadow">
            <div className="flex items-center gap-[6px]">
                <Switch checked={enabled} onChange={setEnabled} />
                <img src={IconInfo} className="w-4 h-4" />
            </div>

            <img src={IconHelp} className="w-6 h-6" />
        </div>
    );
}
