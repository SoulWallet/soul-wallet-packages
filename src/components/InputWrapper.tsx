import React, { ChangeEvent } from "react";
import EyeOpen from "@src/assets/icons/eye-open.svg";
import EyeClose from "@src/assets/icons/eye-close.svg";
import Icon from "./Icon";
import classNames from "classnames";
import Button from "./Button";

interface IProps {
  label: string;
  size?: "s" | "m" | "xs";
  value?: string;
  placeholder?: string;
  errorMsg?: string;
  visible?: boolean;
  className?: string;
  toggleVisibility?: () => void;
  onChange: (value: string) => void;
  buttonText?: string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  onClick?: () => void;
}

const InputStyleMap = {
  xs: "h-6 text-base px-2",
  s: "h-8 text-sm px-3",
  m: "h-12 text-base px-6",
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
  buttonText,
  buttonDisabled,
  buttonLoading,
  onClick,
  inputClassName
}: IProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={classNames("flex flex-col ", className)}>
      {label && (
        <label className="tip-text mb-1" htmlFor={label}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={visible === false ? "password" : "text"}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          className={classNames(
            "w-full rounded-2xl bg-lightWhite border border-lightGray ",
            InputStyleMap[size],
            errorMsg && "border-alarmRed",
            inputClassName
          )}
        />
        <span className="absolute top-[50px] left-0 text-alarmRed text-xs">{errorMsg}</span>
        {visible !== undefined && (
          <Icon
            src={visible ? EyeOpen : EyeClose}
            className="absolute top-3 right-3 cursor-pointer"
            onClick={toggleVisibility}
          />
        )}
        {buttonText && onClick ? (
          <Button
            type="primary"
            className="absolute right-2 top-2 w-[80px] h-8"
            loading={buttonLoading}
            disabled={buttonDisabled}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
