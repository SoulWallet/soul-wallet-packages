import React, { useState } from "react";
import Switch from "../Switch";
import IconInfo from "../../assets/icons/info.svg";
import IconHelp from "../../assets/icons/help.svg";
import config from "@src/config";

export default function Footer() {
    const [enabled, setEnabled] = useState<boolean>(false);
    return (
        <div className="px-6 py-3 flex items-center justify-between absolute bottom-0 left-0 right-0 footer-shadow">
            <div className="flex items-center gap-[6px]">
                <Switch checked={enabled} onChange={setEnabled} />
                <div
                    className="cursor-pointer tooltip"
                    data-tip={"Hello world"}
                >
                    <img src={IconInfo} className="w-4 h-4" />
                </div>
            </div>
            <a href={config.socials.telegram} target="_blank">
                <img src={IconHelp} className="w-6 h-6" />
            </a>
        </div>
    );
}
