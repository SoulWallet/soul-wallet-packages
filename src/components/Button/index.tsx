import React from "react";
import cn from "classnames";
import IconLoading from "@src/assets/loading.gif";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error"; // may add 'dash', 'text', 'link', etc. later

const ButtonTypeStyleMap = {
    default: "btn-purple",
    primary: "btn-purple-primary",
    disable: "btn-purple-disabled",
    error: "btn-purple-error",
};

interface IProps {
    children: React.ReactNode;
    disable?: boolean;
    type?: ButtonType; // 不传使用旧button，传了代表使用淡紫色新button
    className?: string;
    onClick: () => void;
    loading?: boolean;
}

export default function Button({ className, onClick, children, loading, disable, type = "default" }: IProps) {
    const doClick = () => {
        if (!loading && !disable) {
            onClick();
        }
    };

    return (
        <a
            onClick={doClick}
            className={cn(
                "btn w-full flex gap-2 font-bold text-xl py-3 leading-none",
                className,
                loading && "opacity-70  bg-purple cursor-not-allowed",
                type && `btn-purple btn-purple-${type}`,
                disable && ButtonTypeStyleMap["disable"],
            )}
        >
            {loading ? <img src={IconLoading} className="w-24 h-24 " /> : children}
        </a>
    );
}
