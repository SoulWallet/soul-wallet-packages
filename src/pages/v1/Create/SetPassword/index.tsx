import React, { useEffect, useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box, useToast } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import Button from "@src/components/web/Button";
import FormInput from "@src/components/web/Form/FormInput";
import useForm from "@src/hooks/useForm";
import useWalletContext from "@src/context/hooks/useWalletContext";
import PasswordForm from "@src/components/web/PasswordForm";

export default function SetPassword() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const {getAccount} = useWalletContext()
  const toast = useToast()
  const [loading, setLoaing] = useState(false)

  const handleNext = async (values: any) => {
    const { password } = values

    try {
      setLoaing(true)
      await keystore.createNewAddress(password, true);
      getAccount();
      setLoaing(false)
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: CreateStepEn.SetupGuardians,
      });
    } catch (e: any) {
      setLoaing(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  return (
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column" paddingBottom="20px">
      <WalletCard statusText="SETTING UP..." />
      <PasswordForm onSubmit={handleNext} loading={loading} />
    </Box>
  );
}
