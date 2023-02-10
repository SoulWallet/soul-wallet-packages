import React, { ReactNode } from "react";
import ChevronLeft from "@src/assets/icons/chevron-left.svg";
import Icon from "./Icon";
interface IProgressNavBarProps {
    title: string;
    percentage: number;
    onBack?: () => void;
    extraRight?: ReactNode;
}

export default function ProgressNavBar({ title, percentage, onBack, extraRight }: IProgressNavBarProps) {
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center " onClick={onBack}>
                    <Icon src={ChevronLeft} />
                    <span className="font-bold text-xl text-black ml-4 -tracking-[0.01em]">{title}</span>
                </div>
                {extraRight}
            </div>

            <div className="w-full h-2 bg-[#EFEFEF] rounded-2">
                <span className={`w-${percentage}p`} />
            </div>
        </div>
    );
}
