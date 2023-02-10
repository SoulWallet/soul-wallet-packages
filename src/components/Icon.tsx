import classNames from "classnames";
import React from "react";

interface IProps {
    src: string;
    className?: string;
    onClick?: () => void;
}

export default function Icon({ src, className, onClick }: IProps) {
    return <img src={src} className={classNames("w-24 h-24", className)} onClick={onClick} />;
}
