import React from "react";
import IconArrowBack from "@src/assets/arrow-left.svg";

interface IPageTitle {
    title: string;
    onBack?: () => void;
}

export default function PageTitle({ title, onBack }: IPageTitle) {
    return (
        <div className="py-4">
            {onBack && (
                <img
                    src={IconArrowBack}
                    className="cursor-pointer w-6 mb-2"
                    onClick={onBack}
                />
            )}
            <div className="page-title">{title}</div>
        </div>
    );
}
