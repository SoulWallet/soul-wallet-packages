import React from "react";
import cn from "classnames";
import IconLoading from "@src/assets/loading.gif";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error" | "reject" | "link"; // may add 'dash', 'text', 'link', etc. later

const ButtonTypeStyleMap = {
  default: "btn-black",
  primary: "btn-black-primary",
  disable: "btn-black-disabled",
  error: "btn-black-error",
  reject: "btn-black-reject",
};

interface IProps {
  children: React.ReactNode;
  type?: ButtonType; // 不传使用旧button，传了代表使用淡紫色新button
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
}

export default function Button({ className, onClick, children, loading, disabled, type = "default", href }: IProps) {
  const doClick = () => {
    if (!loading && !disabled) {
      onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }

  return (
    <a
      {...moreProps}
      onClick={doClick}
      className={cn(
        "btn font-bold text-xl py-1 leading-none rounded-2xl",
        className,
        loading && "opacity-70 bg-black cursor-not-allowed",
        type && `btn-black btn-black-${type}`,
        disabled && ButtonTypeStyleMap["disable"],
      )}
    >
      {loading ? <img src={IconLoading} className="w-6 h-6 " /> : children}
    </a>
  );
}
