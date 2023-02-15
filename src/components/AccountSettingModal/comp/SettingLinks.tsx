import React from "react";
import config from "@src/config";

interface ISettingLinks {
    onChange: (index: number) => void;
}

export default function SettingLinks({ onChange }: ISettingLinks) {
    const linksStyle =
        "text-black leading-none hover:bg-gray40 cursor-pointer px-4 py-3";
    return (
        <div className="py-3 flex flex-col">
            <a className={linksStyle} onClick={() => onChange(1)}>
                Account details
            </a>
            <a className={linksStyle} onClick={() => onChange(2)}>
                Edit guardian list
            </a>
            <a
                target="_blank"
                href={config.socials.telegram}
                className={linksStyle}
            >
                Download guardian list
            </a>
            <a target="_blank" className={linksStyle}>
                view on explorer
            </a>
        </div>
    );
}
