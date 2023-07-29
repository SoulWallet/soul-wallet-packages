import React, { useEffect, useState } from "react";
import Button from "@src/components/web/Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import FormInput from "@src/components/web/Form/FormInput";

interface IProps {
  nextStep?: any;
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
    /* console.log('handleNext', password)
     * if ((password?.length ?? 0) < 9) {
     *   setPasswordMessage("Password must be at least 9 characters long");
     *   return;
     * }
     * password && onSubmit(password);

     * nextStep && */
    console.log('handleNext', nextStep)
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
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column">
      <WalletCard statusText="SETTING UP..." />
      <FormInput
        label=""
        placeholder="Set Password"
        value={password}
        errorMsg={passwordMessage}
        onChange={(val) => setPassword(val)}
        isPassword={true}
      />
      <PasswordStrengthBar password={password} />
      <FormInput
        label=""
        placeholder="Confirm password"
        value={confirmPwd}
        errorMsg={(password?.length ?? 0) < 9 || isPwdSame ? undefined : "Please enter the same password"}
        onChange={(val) => setConfirmPwd(val)}
        _styles={{ marginTop: '0.75em' }}
        isPassword={true}
      />
      <Button onClick={handleNext} _styles={{ marginTop: '0.75em' }}>Continue</Button>
    </Box>
  );
};

export default PasswordSetter;
