import React from "react";
import Logo from "@src/assets/logo-v2.svg";
import LogoText from "@src/assets/logo-text-v2.svg";
import classNames from "classnames";

export default function LogoV2({ classname }: { classname?: string }) {
    return (
        <div className={classNames("flex flex-row h-88 items-center justify-self-center", classname)}>
            <img src={Logo} className="w-58 h-88" />
            <img src={LogoText} className="ml-4 w-156 h-23 " />
        </div>
    );
}
