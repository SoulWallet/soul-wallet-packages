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

interface PasswordFormField {
  password?: string;
  confirmPassword?: string;
}

const validate = (values: PasswordFormField) => {
  const errors: PasswordFormField = {}
  const { password, confirmPassword } = values

  if (!password || password.length < 9) {
    errors.password = 'Password must be at least 9 characters long'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Please enter the same password'
  }

  return errors
}

export default function SetPassword() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const {getAccount} = useWalletContext()
  const toast = useToast()

  const {
    values,
    errors,
    invalid,
    onChange,
    onBlur,
    showErrors
  } = useForm({
    fields: ['password', 'confirmPassword'],
    validate
  })

  const [loading, setLoaing] = useState(false)
  const disabled = invalid || loading

  const handleNext = async () => {
    const { password } = values

    try {
      if (password) {
        setLoaing(true)
        await keystore.createNewAddress(password, true);
        getAccount();
        setLoaing(false)
        dispatch({
          type: StepActionTypeEn.JumpToTargetStep,
          payload: CreateStepEn.SetupGuardians,
        });
      }
    } catch (e: any) {
      setLoaing(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  return (
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column">
      <WalletCard statusText="SETTING UP..." />
      <FormInput
        label=""
        placeholder="Set Password"
        value={values.password}
        onChange={onChange('password')}
        onBlur={onBlur('password')}
        errorMsg={showErrors.password && errors.password}
        isPassword={true}
      />
      <PasswordStrengthBar password={values.password || ''} />
      <FormInput
        label=""
        placeholder="Confirm password"
        value={values.confirmPassword}
        onChange={onChange('confirmPassword')}
        onBlur={onBlur('confirmPassword')}
        errorMsg={showErrors.confirmPassword && errors.confirmPassword}
        _styles={{ marginTop: '0.75em' }}
        isPassword={true}
      />
      <Button
        disabled={disabled}
        onClick={handleNext}
        _styles={{ marginTop: '0.75em' }}
      >
        Continue
      </Button>
    </Box>
  );
}
