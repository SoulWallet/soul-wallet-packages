import React from "react";
import cn from "classnames";
import IconInfo from "@src/assets/icons/info.svg";

type IInfoTip = {
    title: string;
    className?: string;
};

export default function InfoTip({ title, className }: IInfoTip) {
    return (
        <div className={cn("cursor-pointer tooltip tooltip-right", className)} data-tip={title}>
            <img src={IconInfo} className="w-4 h-4" />
        </div>
    );
}
