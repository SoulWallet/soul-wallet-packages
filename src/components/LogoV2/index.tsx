import React from "react";
import Logo from "@src/assets/logo-v3.svg";
import LogoText from "@src/assets/logo-text-v3.svg";
import classNames from "classnames";

export default function LogoV2({ classname }: { classname?: string }) {
  return (
    <div className={classNames("logo flex flex-row h-58 items-center justify-self-center", classname)}>
      <img src={Logo} className="logo-icon w-58 h-58" />
      <img src={LogoText} className="logo-text ml-4 w-156 h-23 " />
    </div>
  );
}
