import React from "react";
import IconChecked from "@src/assets/checked.svg";
import cn from "classnames";

interface InputProps {
    label?: string;
    type?: string;
    placeholder?: string;
    verified?: boolean;
    value: string;
    error: string;
    ExtraButton?: React.ReactNode;
    onEnter?: (e: any) => void;
    onChange: (value: string) => void;
}

export function Input({
    value,
    error,
    placeholder,
    type = "text",
    verified,
    label,
    ExtraButton,
    onEnter,
    onChange,
}: InputProps) {
    const onKeyDown = (e: any) => {
        const { keyCode } = e;
        if (keyCode === 13 && onEnter) {
            onEnter();
        }
    };

    return (
        <div>
            {label && (
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
            )}

            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={cn("input w-full", error && "input-error")}
                />
                {verified && (
                    <img
                        src={IconChecked}
                        className="absolute right-4 top-0 bottom-0 my-auto"
                    />
                )}
                <div className="absolute right-4 flex items-center top-0 bottom-0">
                    {ExtraButton}
                    {/* <ExtraButton /> */}
                </div>
            </div>

            {error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{error}</span>
                </label>
            )}
        </div>
    );
}
