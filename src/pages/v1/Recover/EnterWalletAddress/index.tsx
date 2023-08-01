import Dropdown, { OptionItem } from "@src/components/Dropdown";
import InputWrapper from "@src/components/InputWrapper";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import config from "@src/config";
import PayTokenSelect from "@src/components/PayTokenSelect";
import { getLocalStorage } from "@src/lib/tools";
import React, { useEffect, useState } from "react";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";

interface IRecoverStarter {
  onSubmit: (wAddress: string, pToken: string) => void;
}

const validate = (values: any) => {
  const errors = {}
  const { address } = values
  return errors
}

const EnterWalletAddress = ({ onSubmit }: IRecoverStarter) => {
  const dispatch = useStepDispatchContext();

  const {
    values,
    errors,
    invalid,
    onChange,
    onBlur,
    showErrors
  } = useForm({
    fields: ['address'],
    validate
  })

  const handleNext = () => {
    /* if (!address || !payToken) {
     *   return;
     * }
     * onSubmit(address, payToken); */
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.ResetPassword,
    });
  };

  const getStoredWalletAddress = async () => {
    /* const wAddress = await getLocalStorage("walletAddress");
     * if (wAddress) {
     *   setAddress(wAddress);
     * } */
  };

  useEffect(() => {
    getStoredWalletAddress();
  }, []);

  return (
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>
        Wallet recovery
      </Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center" maxWidth="500px">
          Enter the address of the Soul Wallet you want to recover.
        </TextBody>
      </Box>
      <FormInput
        label=""
        placeholder="Enter wallet address"
        value={values.address}
        onChange={onChange('address')}
        onBlur={onBlur('address')}
        errorMsg={showErrors.address && errors.address}
        _styles={{ marginTop: '0.75em', width: '100%' }}
      />
      <Button onClick={handleNext} _styles={{ width: '100%', marginTop: '0.75em' }}>
        Next
      </Button>
    </Box>
  )
};

export default EnterWalletAddress;
