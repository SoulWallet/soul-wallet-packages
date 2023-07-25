import InputWrapper from "@src/components/InputWrapper";
import React, { useEffect, useState } from "react";
import { SButton } from "./Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCardIcon from "@src/components/Icons/WalletCard";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface IProps {
    nextStep?: number;
    onSubmit: (password: string) => void;
}

export const PasswordSetter = ({ nextStep, onSubmit }: IProps) => {
    const dispatch = useStepDispatchContext();

    const [password, setPassword] = useState<string>("");
    const [confirmPwd, setConfirmPwd] = useState<string>();
    const [createPwdVisible, setCreatePwdVisible] = useState(false);
    const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);
    const [isPwdSame, setIsPwdSame] = useState(true);
    const [passwordMessage, setPasswordMessage] = useState<string>();
    const [nextable, setNextable] = useState(false);

  const handleNext = () => {
    console.log('handleNext', password)
    if ((password?.length ?? 0) < 9) {
            setPasswordMessage("Password must be at least 9 characters long");
            return;
        }
        password && onSubmit(password);

        nextStep &&
            dispatch({
                type: StepActionTypeEn.JumpToTargetStep,
                payload: nextStep,
            });
    };

    useEffect(() => {
        // 密码均不为空 且 全等
        const pwdSame = !(password || confirmPwd) || password === confirmPwd;
        setIsPwdSame(pwdSame);

        // 密码长度不小于9 且 密码相等
        setNextable((password?.length ?? 0) > 8 && pwdSame);
    }, [password, confirmPwd]);

  return (
    <div className="w-base mt-4 flex flex-col">
      <div className="wallet-card">
        <div className="wallet-card-icon">
          <WalletCardIcon />
        </div>
        <div className="wallet-card-content">
          <div className="wallet-card-text">
            <div className="wallet-card-status">SETTING UP...</div>
          </div>
          <div className="wallet-card-text">NEW SOUL WALLET...</div>
        </div>
      </div>
      <InputWrapper
        label=""
        placeholder="Set Password"
        value={password}
        visible={createPwdVisible}
        toggleVisibility={() => setCreatePwdVisible((prev: boolean) => !prev)}
        errorMsg={passwordMessage}
        onChange={(val) => setPassword(val)}
      />

      <PasswordStrengthBar className="mt-4" password={password} />

      <InputWrapper
        label=""
        className="mt-3"
        placeholder="Confirm password"
        value={confirmPwd}
        visible={confirmPwdVisible}
        errorMsg={(password?.length ?? 0) < 9 || isPwdSame ? undefined : "Please enter the same password"}
        toggleVisibility={() => setConfirmPwdVisible((prev: boolean) => !prev)}
        onChange={(val) => setConfirmPwd(val)}
      />

      <SButton className="mb-6 mt-6 rounded-2xl" type={"primary"} onClick={handleNext}>
        Continue
      </SButton>
    </div>
  );
};

export default PasswordSetter;
