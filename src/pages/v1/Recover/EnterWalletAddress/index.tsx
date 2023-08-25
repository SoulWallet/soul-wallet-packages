import React, { useEffect, useState } from "react";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { ethers } from "ethers";
import Button from "@src/components/web/Button";
import { Box, Text, Image, useToast } from "@chakra-ui/react"
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";
import api from "@src/lib/api";
import { useGuardianStore } from "@src/store/guardian";

interface IRecoverStarter {
  onSubmit: (wAddress: string, pToken: string) => void;
}

const validate = (values: any) => {
  const errors: any = {}
  const { address } = values

  if (!ethers.isAddress(address)) {
    errors.address = 'Invalid Address'
  }

  return errors
}

const EnterWalletAddress = ({ onSubmit }: IRecoverStarter) => {
  const [loading, setLoading] = useState(false)
  const { setRecoveringGuardians, setRecoveringThreshold, setRecoveringSlot, setRecoveringSlotInitInfo, setRecoverRecordId } = useGuardianStore();
  const dispatch = useStepDispatchContext();
  const toast = useToast()

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

  const disabled = loading || invalid

  const handleNext = async () => {
    try {
      setLoading(true)
      const result = await api.guardian.getSlotInfo({ walletAddress: values.address })
      const data = result.data
      const guardianDetails = data.guardianDetails
      const guardians = guardianDetails.guardians
      const threshold = guardianDetails.threshold
      const slot = data.slot
      const slotInitInfo = data.slotInitInfo

      setRecoverRecordId(null)
      setRecoveringGuardians(guardians)
      setRecoveringThreshold(threshold)
      setRecoveringSlot(slot)
      setRecoveringSlotInitInfo(slotInitInfo)

      setLoading(false)

      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.ResetPassword,
      });
    } catch (e: any) {
      /* setLoading(false)
       * toast({
       *   title: e.message,
       *   status: "error",
       * }) */
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.UploadGuardians,
      });
    }
  };

  return (
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
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
      <Button
        onClick={handleNext}
        _styles={{ width: '100%', marginTop: '0.75em' }}
        loading={loading}
        disabled={disabled}
      >
        Next
      </Button>
    </Box>
  )
};

export default EnterWalletAddress;
