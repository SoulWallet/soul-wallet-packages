import React, { ReactNode } from "react";
import leftIcon from "@assets/icons/chevron-left.svg";
interface IProgressWindowProps {
    title: string;
    percentage: number;
    onBack?: () => void;
    children: ReactNode;
}

export default function ProgressWindow({
    title,
    percentage,
    onBack,
    children,
}: IProgressWindowProps) {
    return (
        <div className=" rounded-24 progress-window-shadow">
            <div>
                <img src={leftIcon} />
                <text>{title}</text>
            </div>
            <div>{children}</div>
        </div>
    );
}
