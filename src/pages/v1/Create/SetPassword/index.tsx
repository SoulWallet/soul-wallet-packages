import React, { useEffect, useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box, useToast } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import FormInput from "@src/components/web/Form/FormInput";
import useForm from "@src/hooks/useForm";
import useWalletContext from "@src/context/hooks/useWalletContext";
import PasswordForm from "@src/components/web/PasswordForm";
import ArrowLeftIcon from "@src/components/Icons/ArrowLeft";
import useBrowser from "@src/hooks/useBrowser";
import Steps from "@src/components/web/Steps";

export default function SetPassword({ setPassword, onStepChange }: any) {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const {getAccount} = useWalletContext()
  const toast = useToast()
  const [loading, setLoaing] = useState(false)
  const { navigate } = useBrowser()

  const handleNext = async (values: any) => {
    const { password } = values

    if (password) {
      setPassword(password)
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: CreateStepEn.SetGuardians,
      });
    }
  }

  const goBack = () => {
    navigate('launch?mode=web')
  }

  return (
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column" paddingBottom="20px">
      <WalletCard statusText="SETTING UP..." steps={<Steps backgroundColor="#29510A" foregroundColor="#E2FC89" count={3} activeIndex={0} marginTop="24px" onStepChange={onStepChange} />} />
      <TextButton
        color="#1E1E1E"
        fontSize="16px"
        fontWeight="800"
        width="57px"
        padding="0"
        alignItems="center"
        justifyContent="center"
        onClick={goBack}
      >
        <ArrowLeftIcon />
        <Box marginLeft="2px">Back</Box>
      </TextButton>
      <PasswordForm onSubmit={handleNext} loading={loading} />
    </Box>
  )
}
