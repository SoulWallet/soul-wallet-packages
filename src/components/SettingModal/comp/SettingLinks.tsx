import React from "react";
import config from "@src/config";

interface ISettingLinks {
    onChange: (index: number) => void;
}

export default function SettingLinks({ onChange }: ISettingLinks) {
    const linksStyle =
        "text-black leading-none hover:text-gray60 cursor-pointer";
    return (
        <div className="p-6 flex flex-col gap-5">
            <a className={linksStyle} onClick={() => onChange(1)}>
                Reset login password
            </a>
            <a className={linksStyle} onClick={() => onChange(2)}>
                Bundler URL
            </a>
            <a
                target="_blank"
                href={config.socials.telegram}
                className={linksStyle}
            >
                Support
            </a>
            <a target="_blank" className={linksStyle}>
                About
            </a>
        </div>
    );
}
