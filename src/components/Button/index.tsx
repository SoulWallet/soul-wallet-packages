import React from "react";
import cn from "classnames";
import IconLoading from "@src/assets/loading.gif";

interface IProps {
    children: React.ReactNode;
    classNames?: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function Button({
    classNames,
    onClick,
    children,
    loading,
    disabled,
}: IProps) {
    const doClick = () => {
        if (!loading || disabled) {
            onClick();
        }
    };

    return (
        <a
            onClick={doClick}
            className={cn(
                "btn flex gap-2 font-bold text-xl py-3 leading-none",
                classNames,
                (loading || disabled) && "opacity-70 cursor-not-allowed ",
            )}
        >
            {loading && <img src={IconLoading} className="w-4 h-4" />}
            {children}
        </a>
    );
}
