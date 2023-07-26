import React from "react";
import config from "@src/config";

interface ISettingLinks {
    onChange: (index: number) => void;
}

export default function SettingLinks({ onChange }: ISettingLinks) {
    const linksStyle = "text-black leading-none hover:bg-gray40 cursor-pointer px-6 py-3";
    return (
        <div className="pt-4 pb-6 flex flex-col">
            <a className={linksStyle} onClick={() => onChange(1)}>
                Reset login password
            </a>
            <a className={linksStyle} onClick={() => onChange(2)}>
                Bundler URL
            </a>
        </div>
    );
}
