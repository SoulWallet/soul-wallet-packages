import React from "react";
import cn from "classnames";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import ApprovePaymaster from "@src/components/ApprovePaymaster";

interface ISettingLinks {
    onChange: (index: number) => void;
}

export default function SettingLinks({ onChange }: ISettingLinks) {
    const { walletAddress } = useWalletContext();
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
            <a className={cn(linksStyle, "flex justify-between items-center")}>
                <ApprovePaymaster />
            </a>
            <a
                target="_blank"
                className={linksStyle}
                href={`${config.scanUrl}/address/${walletAddress}`}
            >
                view on explorer
            </a>
        </div>
    );
}
