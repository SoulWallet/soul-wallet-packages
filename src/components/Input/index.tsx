import React from "react";
import IconChecked from "@src/assets/checked.svg";
import cn from "classnames";
import { IInputProps } from "@src/types/IInput";

export function Input({
    value,
    error,
    placeholder,
    className,
    memo,
    type = "text",
    verified,
    label,
    ExtraButton,
    onEnter,
    onChange,
}: IInputProps) {
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
                    <span className="label-text text-gray60 text-base leading-none">
                        {label}
                    </span>
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
                    className={cn(
                        "input w-full",
                        error && "input-error",
                        className,
                    )}
                />
                {verified && (
                    <img
                        src={IconChecked}
                        className="absolute right-4 top-0 bottom-0 my-auto"
                    />
                )}
                <div className="absolute right-4 flex items-center top-0 bottom-0">
                    {ExtraButton}
                </div>
            </div>

            {!error && memo && (
                <label className="label">
                    <span className="label-text-alt text-sm">{memo}</span>
                </label>
            )}

            {error && (
                <label className="label">
                    <span className="label-text-alt text-sm text-red-500">
                        {error}
                    </span>
                </label>
            )}
        </div>
    );
}
