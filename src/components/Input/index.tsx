import React, { useState } from "react";
import IconChecked from "@src/assets/checked.svg";
import IconEyeOpen from "@src/assets/icons/eye-open.svg";
import IconEyeCLose from "@src/assets/icons/eye-close.svg";
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
    labelColor,
    onEnter,
    onChange,
}: IInputProps) {
    const [eyeOpen, setEyeOpen] = useState(false);

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
                    <span
                        className={cn(
                            "label-text text-base leading-none",
                            labelColor || "text-gray60",
                        )}
                    >
                        {label}
                    </span>
                </label>
            )}

            <div className="relative">
                <input
                    type={type === "password" && eyeOpen ? "text" : type}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className="" {cn(
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

                {type === "password" && (
                    <img
                        src={eyeOpen ? IconEyeOpen : IconEyeCLose}
                        onClick={() => setEyeOpen((prev) => !prev)}
                        className="absolute right-4 top-0 bottom-0 my-auto cursor-pointer"
                    />
                )}
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
