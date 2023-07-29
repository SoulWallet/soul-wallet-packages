import React, { useEffect, useState } from "react";
import useKeystore from "@src/hooks/useKeystore";
import { RecoverStepEn } from "@src/context/StepContext";
import Button from "@src/components/web/Button";
import { StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

export default function PasswordResetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeystore();

  const handleSubmitPassword = async (pwd: string) => {
    await keystore.createNewAddress(pwd, false);
  };

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
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.GuardiansImporting,
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
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>
        Reset wallet password
      </Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center" maxWidth="500px">
          Please set a new password to begin recovery
        </TextBody>
      </Box>
      <FormInput
        label=""
        placeholder="Set Password"
        value={password}
        errorMsg={passwordMessage}
        onChange={(val) => setPassword(val)}
        isPassword={true}
        _styles={{ marginTop: '0.75em', width: '100%' }}
      />
      <PasswordStrengthBar password={password} _styles={{ marginTop: '0.75em', width: '100%' }} />
      <FormInput
        label=""
        placeholder="Confirm password"
        value={confirmPwd}
        errorMsg={(password?.length ?? 0) < 9 || isPwdSame ? undefined : "Please enter the same password"}
        onChange={(val) => setConfirmPwd(val)}
        _styles={{ marginTop: '0.75em', width: '100%' }}
        isPassword={true}
      />
      <Button onClick={handleNext} _styles={{ width: '100%', marginTop: '0.75em' }}>Continue</Button>
    </Box>
  );
}
