import React, { useState, useEffect } from "react";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";
import { RecoveryActionTypeEn, useRecoveryDispatchContext } from "@src/context/RecoveryContext";
import { nanoid } from "nanoid";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Input, Text, Image, useToast } from "@chakra-ui/react"
import FormInput from "@src/components/web/Form/FormInput";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";
import Icon from "@src/components/Icon";
import { nextRandomId, validateEmail } from "@src/lib/tools";
import { getLocalStorage } from "@src/lib/tools";
import MinusIcon from "@src/assets/icons/minus.svg";
import useSdk from '@src/hooks/useSdk';
import useKeystore from "@src/hooks/useKeystore";
import useWalletContext from '@src/context/hooks/useWalletContext';
import { useAddressStore } from "@src/store/address";
import { useGuardianStore } from "@src/store/guardian";
import api from "@src/lib/api";
import { ethers } from "ethers";
import config from "@src/config";
import useConfig from "@src/hooks/useConfig";

const defaultGuardianIds = [nextRandomId(), nextRandomId(), nextRandomId()]

const getFieldsByGuardianIds = (ids: any) => {
  const fields = []

  for (const id of ids) {
    const addressField = `address_${id}`
    const nameField = `name_${id}`
    fields.push(addressField)
    fields.push(nameField)
  }

  return fields
}

const getInitialValues = (ids: string[], guardians: string[]) => {
  const idCount = ids.length
  const guardianCount = guardians.length
  const count = idCount > guardianCount ? idCount : guardianCount
  const values: any = {}

  for (let i = 0; i < count; i++) {
    values[`address_${ids[i]}`] = guardians[i]
  }

  return values
}

const validate = (values: any) => {
  const errors: any = {}
  const addressKeys = Object.keys(values).filter(key => key.indexOf('address') === 0)
  const nameKeys = Object.keys(values).filter(key => key.indexOf('name') === 0)
  const existedAddress = []

  for (const addressKey of addressKeys) {
    const address = values[addressKey]

    if (address && address.length && !ethers.isAddress(address)) {
      errors[addressKey] = 'Invalid Address'
    } else if (existedAddress.indexOf(address) !== -1) {
      errors[addressKey] = 'Duplicated Address'
    } else if (address && address.length) {
      existedAddress.push(address)
    }
  }

  return errors
}

const amountValidate = (values: any, props: any) => {
  const errors: any = {}

  if (!values.amount || !Number.isInteger(Number(values.amount)) || Number(values.amount) < 1 || Number(values.amount) > Number(props.guardiansCount)) {
    errors.amount = 'Invalid Amount'
  }

  return errors
}

const UploadGuardians = () => {
  const { getJsonFromFile } = useTools();
  const keystore = useKeystore();
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds))
  const [guardiansList, setGuardiansList] = useState([])
  const { account } = useWalletContext();
  const { recoveringGuardians, recoveringThreshold, recoveringSlot, recoveringSlotInitInfo, setRecoverRecordId, newKey } = useGuardianStore();
  const [amountData, setAmountData] = useState<any>({})
  const toast = useToast()
  const {chainConfig} = useConfig();

  const stepDispatch = useStepDispatchContext();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate,
    initialValues: getInitialValues(defaultGuardianIds, recoveringGuardians)
  })

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: recoveringThreshold
    }
  })

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length })
  }, [guardiansList])

  useEffect(() => {
    setGuardiansList(Object.keys(values).filter(key => key.indexOf('address') === 0).map(key => values[key]).filter(address => !!String(address).trim().length) as any)
  }, [values])

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length })
  }, [guardiansList])

  const handleNext = async () => {
    try {
      setLoading(true)
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
      setLoading(false)
      console.log('handleNext', params, result)

      stepDispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.GuardiansChecking,
      });
    } catch (e: any) {
      setLoading(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  const handleFileChange = async (event: any) => {
    try {
      setUploading(true)
      const file = event.target.files[0];

      if (!file) {
        return
      }

      const fileJson: any = await getJsonFromFile(file)

      const data = fileJson
      const guardianDetails = data.guardianDetails
      const keystore = data.keystore
      const guardians = guardianDetails.guardians
      const threshold = guardianDetails.threshold
      const slot = data.slot
      const slotInitInfo = data.slotInitInfo
      // const newKey = ethers.zeroPadValue(account, 32)

      const params = {
        guardianDetails,
        slot,
        slotInitInfo,
        keystore,
        newKey
      }

      const result = await api.guardian.createRecoverRecord(params)
      const recoveryRecordID = result.data.recoveryRecordID
      setRecoverRecordId(recoveryRecordID)
      setUploading(false)
      console.log('handleFileParseResult', fileJson, params, result)

      stepDispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.GuardiansChecking,
      });
    } catch (e: any) {
      setUploading(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  }

  const addGuardian = () => {
    const id = nextRandomId()
    const newGuardianIds = [...guardianIds, id]
    const newFields = getFieldsByGuardianIds(newGuardianIds)
    setGuardianIds(newGuardianIds)
    setFields(newFields)
    addFields(getFieldsByGuardianIds([id]))
  };

  const removeGuardian = (deleteId: string) => {
    if (guardianIds.length > 1) {
      const newGuardianIds = guardianIds.filter(id => id !== deleteId)
      const newFields = getFieldsByGuardianIds(newGuardianIds)
      setGuardianIds(newGuardianIds)
      setFields(newFields)
      removeFields(getFieldsByGuardianIds([deleteId]))
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Heading1 marginBottom="2em">
        Upload guardians file
      </Heading1>
      <Box marginBottom="0.75em">
        <TextBody fontSize="0.875em" textAlign="center">
          Due to your choice of private onchain guardians, please upload the guardians file you saved during setup.
        </TextBody>
      </Box>
      <Button disabled={uploading} loading={uploading} _styles={{ width: '100%', marginTop: '0.75em', position: 'relative' }}>
        Upload file
        <Input
          type="file"
          id="file"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          background="red"
          opacity="0"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  )
};

export default UploadGuardians;
