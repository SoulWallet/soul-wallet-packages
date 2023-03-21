import React, { useEffect, useState } from "react";
import Switch from "../Switch";
import { shallow } from "zustand/shallow";
import browser from "webextension-polyfill";
import { useSettingStore } from "@src/store/settingStore";
import IconHelp from "../../assets/icons/help.svg";
import config from "@src/config";
import InfoTip from "../InfoTip";

export default function Footer() {
    const [shouldInject, setShouldInject] = useState(false);

    const toggleDefaultProvider = async (val: boolean) => {
        await browser.storage.local.set({ shouldInject: val });
        setShouldInject(val);
    };

    const checkShouldInject = async () => {
        const res: any = await browser.storage.local.get("shouldInject");
        console.log("should inject local", res);
        setShouldInject(res);
    };

    useEffect(() => {
        checkShouldInject();
    }, []);

    return (
        // <div className="px-6 py-3 flex items-center justify-between absolute bottom-0 left-0 right-0 footer-shadow">
        <div className="px-6 py-3 flex items-center justify-between footer-shadow relative bottom-0">
            <div className="flex items-center gap-[6px]">
                <Switch checked={shouldInject} onChange={toggleDefaultProvider} />
                <InfoTip
                    title={shouldInject ? "Turn off Soul as your default wallet." : "Set Soul as your default wallet"}
                />
            </div>
            <a href={config.socials.telegram} target="_blank">
                <img src={IconHelp} className="w-6 h-6" />
            </a>
        </div>
    );
}
