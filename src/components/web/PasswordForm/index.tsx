import React, { useEffect, useState, Fragment } from "react";
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

export default function SetPasswordForm({ onSubmit, loading }: any) {
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

  const disabled = invalid || loading

  const handleSubmit = () => {
    const { password } = values
    if (disabled || !password) return
    if (onSubmit) onSubmit(values)
  }

  return (
    <Box width="100%">
      <FormInput
        label=""
        placeholder="Set Password"
        value={values.password}
        onChange={onChange('password')}
        onBlur={onBlur('password')}
        errorMsg={showErrors.password && errors.password}
        isPassword={true}
        autoFocus={true}
        onEnter={handleSubmit}
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
        onEnter={handleSubmit}
      />
      <Button
        disabled={disabled}
        onClick={handleSubmit}
        _styles={{ marginTop: '0.75em', width: "100%" }}
      >
        Continue
      </Button>
    </Box>
  );
}
