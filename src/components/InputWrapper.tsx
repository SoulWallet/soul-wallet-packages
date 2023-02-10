import React, { ChangeEvent, useMemo } from "react";
import EyeOpen from "@src/assets/icons/eye-open.svg";
import EyeClose from "@src/assets/icons/eye-close.svg";
import Icon from "./Icon";
import classNames from "classnames";

interface IProps {
    label: string;
    size?: "s" | "m";
    value?: string;
    placeholder?: string;
    errorMsg?: string;
    visible?: boolean;
    className?: string;
    toggleVisibility?: () => void;
    onChange: (value: string) => void;
}

const InputStyleMap = {
    s: "h-32 text-sm px-12",
    m: "h-48 text-base px-24",
};

export default function InputWrapper({
    size = "m",
    className = "",
    label,
    value,
    placeholder,
    errorMsg,
    visible,
    toggleVisibility,
    onChange,
}: IProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`flex flex-col w-full ${className}`}>
            <label className="tip-text mb-4 " htmlFor={label}>
                {label}
            </label>

            <div className="relative">
                <input
                    type={visible === undefined ? "text" : "password"}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={handleChange}
                    className={classNames(
                        "w-full rounded-24 bg-lightWhite border border-lightGray ",
                        InputStyleMap[size],
                        errorMsg && "border-alarmRed",
                    )}
                />
                <span className="absolute top-50 left-0 text-alarmRed text-xs">{errorMsg}</span>
                {visible !== undefined && (
                    <Icon
                        src={visible ? EyeOpen : EyeClose}
                        className="absolute top-12 right-12 cursor-pointer"
                        onClick={toggleVisibility}
                    />
                )}
            </div>
        </div>
    );
}
