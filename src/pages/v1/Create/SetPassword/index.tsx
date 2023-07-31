import React, { useEffect, useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import Button from "@src/components/web/Button";
import FormInput from "@src/components/web/Form/FormInput";

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

  const [formValues, setFormValues] = useState<PasswordFormField>({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<PasswordFormField>({ password: '', confirmPassword: '' })
  const [invalid, setInvalid] = useState(false)
  const [shouldDisplayError, setShouldDisplayError] = useState<PasswordFormField>({})
  const disabled = invalid

  const change = (fieldName: string) => (value: any) => {
    setFormValues({ ...formValues, [fieldName]: value })
  }

  const blur = (fieldName: string) => (value: any) => {
    setShouldDisplayError({ ...shouldDisplayError , [fieldName]: true })
  }

  const handleNext = async () => {
    const { password } = formValues

    if (password) {
      await keystore.createNewAddress(password, true);

      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: CreateStepEn.SetupGuardians,
      });
    }
  };

  useEffect(() => {
    const errors = validate(formValues)
    setErrors(errors)
    setInvalid(!!(errors.password || errors.confirmPassword))
  }, [formValues]);

  return (
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column">
      <WalletCard statusText="SETTING UP..." />
      <FormInput
        label=""
        placeholder="Set Password"
        value={formValues.password}
        onChange={change('password')}
        onBlur={blur('password')}
        errorMsg={shouldDisplayError.password ? errors.password : ''}
        isPassword={true}
      />
      <PasswordStrengthBar password={formValues.password || ''} />
      <FormInput
        label=""
        placeholder="Confirm password"
        value={formValues.confirmPassword}
        onChange={change('confirmPassword')}
        onBlur={blur('confirmPassword')}
        errorMsg={shouldDisplayError.confirmPassword ? errors.confirmPassword : ''}
        _styles={{ marginTop: '0.75em' }}
        isPassword={true}
      />
      <Button disabled={disabled} onClick={handleNext} _styles={{ marginTop: '0.75em' }}>Continue</Button>
    </Box>
  );
}
