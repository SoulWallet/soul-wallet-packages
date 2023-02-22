import React from "react";
import cn from "classnames";
import IconLoading from "@src/assets/loading.gif";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error" | "reject"; // may add 'dash', 'text', 'link', etc. later

const ButtonTypeStyleMap = {
    default: "btn-purple",
    primary: "btn-purple-primary",
    disable: "btn-purple-disabled",
    error: "btn-purple-error",
    reject: "btn-purple-reject",
};

interface IProps {
    children: React.ReactNode;
    type?: ButtonType; // 不传使用旧button，传了代表使用淡紫色新button
    className?: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function Button({ className, onClick, children, loading, disabled, type = "default" }: IProps) {
    const doClick = () => {
        if (!loading && !disabled) {
            onClick();
        }
    };

    return (
        <a
            onClick={doClick}
            className={cn(
                "btn font-bold text-xl py-1 leading-none",
                className,
                loading && "opacity-70 bg-purple cursor-not-allowed",
                type && `btn-purple btn-purple-${type}`,
                disabled && ButtonTypeStyleMap["disable"],
            )}
        >
            {loading ? <img src={IconLoading} className="w-6 h-6 " /> : children}
        </a>
    );
}
