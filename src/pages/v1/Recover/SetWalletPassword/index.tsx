import React, { useEffect, useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import { CreateStepEn, RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCard from "@src/components/web/WalletCard";
import { Box, useToast } from "@chakra-ui/react"
import PasswordStrengthBar from "@src/components/web/PasswordStrengthBar";
import Button from "@src/components/web/Button";
import FormInput from "@src/components/web/Form/FormInput";
import useForm from "@src/hooks/useForm";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useGuardianStore } from "@src/store/guardian";
import { ethers } from "ethers";
import useConfig from "@src/hooks/useConfig";
import api from "@src/lib/api";

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
  const { getAccount } = useWalletContext()
  const { setNewKey, setRecoverRecordId, recoveringGuardians, recoveringThreshold, recoveringSlot, recoveringSlotInitInfo, newKey } = useGuardianStore();
  const toast = useToast()
  const { chainConfig } = useConfig();

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

  const createRecoverRecord = async (newKey: any) => {
    const keystore = chainConfig.contracts.l1Keystore

    const params = {
      guardianDetails: {
        guardians: recoveringGuardians,
        threshold: recoveringThreshold,
        salt: ethers.ZeroHash
      },
      slot: recoveringSlot,
      slotInitInfo: recoveringSlotInitInfo,
      keystore,
      newKey
    }

    const result = await api.guardian.createRecoverRecord(params)
    const recoveryRecordID = result.data.recoveryRecordID
    setRecoverRecordId(recoveryRecordID)
  }

  const handleNext = async () => {
    const { password } = values
    if (disabled) return

    try {
      if (password) {
        setLoaing(true)
        console.log('loading s', password)
        let newKey = await keystore.createNewAddress(password, false);
        newKey = ethers.zeroPadValue(newKey, 32)
        console.log('newKey', newKey)
        setNewKey(newKey)
        setRecoverRecordId(null)

        console.log('recoveringSlot', recoveringSlot)
        console.log('recoveringSlotInitInfo', recoveringSlotInitInfo)
        if (recoveringSlot && recoveringSlotInitInfo) {
          await createRecoverRecord(newKey)

          dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.GuardiansChecking
          });
        }

        setLoaing(false)
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
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
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
        value={values.password}
        onChange={onChange('password')}
        onBlur={onBlur('password')}
        errorMsg={showErrors.password && errors.password}
        _styles={{ marginTop: '0.75em', width: '100%' }}
        isPassword={true}
        autoFocus={true}
        onEnter={handleNext}
      />
      <PasswordStrengthBar password={values.password || ''} _styles={{ marginTop: '0.75em', width: '100%' }} />
      <FormInput
        label=""
        placeholder="Confirm password"
        value={values.confirmPassword}
        onChange={onChange('confirmPassword')}
        onBlur={onBlur('confirmPassword')}
        errorMsg={showErrors.confirmPassword && errors.confirmPassword}
        _styles={{ marginTop: '0.75em', width: '100%' }}
        isPassword={true}
        onEnter={handleNext}
      />
      <Button
        disabled={disabled}
        onClick={handleNext}
        loading={loading}
        _styles={{ marginTop: '0.75em', width: '100%' }}
      >
        Continue
      </Button>
    </Box>
  );
}
