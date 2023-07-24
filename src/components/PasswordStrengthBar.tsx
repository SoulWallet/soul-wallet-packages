import { usePasswordStrength } from "@src/hooks/usePasswordStrength";
import React from "react";
import classNames from "classnames";

interface IPasswordStrengthBarProps {
    password: string;
    className?: string;
}

const PasswordStrengthBar = ({ password, className }: IPasswordStrengthBarProps) => {
  const passwordStrength = usePasswordStrength(password);

  if (!(password.length && passwordStrength >= 0)) {
    return null
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <div className={classNames("flex flex-row w-full h-1 justify-evenly gap-x-1 px-4")}>
        <span
          className={classNames(
            "pwd-indicator rounded-l-sm",
            password?.length && passwordStrength >= 0 && "bg-red-600",
          )}
        />
        <span className={classNames("pwd-indicator ", passwordStrength > 1 && "bg-red-400")} />
        <span className={classNames("pwd-indicator ", passwordStrength > 2 && "bg-orange-300")}></span>
        <span className={classNames("pwd-indicator rounded-r-sm", passwordStrength > 3 && "bg-green")}></span>
      </div>
      <div className="flex">
        {passwordStrength <= 2 && <div className="text-sm font-bold text-red-400">Weak</div>}
        {passwordStrength > 2 && passwordStrength <= 3 && <div className="text-sm font-bold text-orange-300">Moderate</div>}
        {passwordStrength > 3 && <div className="text-sm font-bold text-green">Strong</div>}
      </div>
    </div>
  );
};

export default PasswordStrengthBar;
