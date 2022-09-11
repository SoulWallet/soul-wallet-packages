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
    onChange: (value: string) => void;
}

export function Input({
    value,
    error,
    placeholder,
    type = "text",
    verified,
    label,
    onChange,
}: InputProps) {
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
                    placeholder={placeholder}
                    className={cn("input w-full", error && "input-error")}
                />
                {verified && (
                    <img
                        src={IconChecked}
                        className="absolute right-4 top-0 bottom-0 my-auto"
                    />
                )}
            </div>

            {error && (
                <label className="label">
                    <span className="label-text-alt text-red-500">{error}</span>
                </label>
            )}
        </div>
    );
}
