import React from "react";
import cn from "classnames";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";
import useBrowser from "@src/hooks/useBrowser";
import ApprovePaymaster from "@src/components/ApprovePaymaster";

interface ISettingLinks {
    onChange: (index: number) => void;
}

export default function SettingLinks({ onChange }: ISettingLinks) {
    const { walletAddress } = useWalletContext();
    const { guardians } = useGlobalStore();
    const { formatGuardianFile, downloadJsonFile } = useTools();
    const { goWebsite } = useBrowser();

    const downloadGuardianList = async () => {
        const jsonToSave = formatGuardianFile(walletAddress, guardians);
        downloadJsonFile(jsonToSave);
    };

    const linksStyle = "text-black leading-none hover:bg-gray40 cursor-pointer px-4 py-3";
    return (
        <div className="py-2 flex flex-col">
            <a className={linksStyle} onClick={() => onChange(1)}>
                Account details
            </a>
            <>
                <a onClick={() => goWebsite("/edit-guardians")} className={linksStyle}>
                    Edit guardian list
                </a>
                <a target="_blank" onClick={downloadGuardianList} className={linksStyle}>
                    Download guardian list
                </a>
                {/* <a className={cn(linksStyle, "flex justify-between items-center")}>
                        <ApprovePaymaster />
                    </a> */}
                <a target="_blank" className={linksStyle} href={`${config.scanUrl}/address/${walletAddress}`}>
                    View on explorer
                </a>
            </>
        </div>
    );
}
