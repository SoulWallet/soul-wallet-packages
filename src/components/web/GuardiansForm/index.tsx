import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import { ethers } from "ethers";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import MinusIcon from "@src/assets/icons/minus.svg";
import { useGlobalStore } from "@src/store/global";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import useSdk from '@src/hooks/useSdk';
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";
import Icon from "@src/components/Icon";
import { nextRandomId } from "@src/lib/tools";
import WarningIcon from "@src/components/Icons/Warning";
import DropDownIcon from "@src/components/Icons/DropDown";
import PlusIcon from "@src/components/Icons/Plus";
import useWalletContext from '@src/context/hooks/useWalletContext';
import GuardiansTips from "@src/components/web/GuardiansTips";
import { useAddressStore } from "@src/store/address";
import { useGuardianStore } from "@src/store/guardian";
import useConfig from "@src/hooks/useConfig";
import { L1KeyStore } from "@soulwallet/sdk";
import { nanoid } from "nanoid";

const defaultGuardianIds = [nextRandomId(), nextRandomId(), nextRandomId()]

const getNumberArray = (count: number) => {
  const arr = []

  for (let i = 1; i <= count; i++) {
    arr.push(i)
  }

  return arr
}

const toHex = (num: any) => {
  let hexStr = num.toString(16)

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr
  }

  hexStr = '0x' + hexStr

  return hexStr
}

const getRecommandCount = (c: number) => {
  if (!c) {
    return 0
  }

  return Math.ceil(c / 2)
}

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

const isENSAddress = (address: string) => {
  const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/
  return ensRegex.test(address)
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

export default function SetGuardiansForm({ onSubmit, loading, textButton }: any) {
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds))
  const [guardiansList, setGuardiansList] = useState([])
  const [amountData, setAmountData] = useState<any>({})
  const {account} = useWalletContext();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate
  })

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount)
    }
  })

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading

  useEffect(() => {
    setGuardiansList(Object.keys(values).filter(key => key.indexOf('address') === 0).map(key => values[key]).filter(address => !!String(address).trim().length) as any)
  }, [values])

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length })
  }, [guardiansList])

  const handleSubmit = async () => {
    if (disabled) return

    const guardiansList = guardianIds.map(id => {
      const addressKey = `address_${id}`
      const nameKey = `name_${id}`
      let address = values[addressKey]

      if (address && address.length) {
        return { address, name: values[nameKey] }
      }

      return null
    }).filter(i => !!i)
    console.log('guardiansList', guardiansList)

    const guardianAddresses = guardiansList.map((item: any) => item.address)
    const guardianNames = guardiansList.map((item: any) => item.name)
    const threshold = amountForm.values.amount || 0

    if (onSubmit) onSubmit(guardianAddresses, guardianNames, threshold)
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

  const selectAmount = (amount: any) => () => {
    amountForm.onChange('amount')(amount)
  }

  useEffect(() => {
    if (!amountForm.values.amount || (Number(amountForm.values.amount) > amountData.guardiansCount)) {
      amountForm.onChange('amount')(getRecommandCount(amountData.guardiansCount))
    }
  }, [amountData.guardiansCount, amountForm.values.amount])

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em" width="100%">
          {(guardianIds).map((id: any, i: number) => (
            <Box position="relative" width="100%" key={id}>
              <DoubleFormInput
                rightPlaceholder={`Guardian address ${i + 1}`}
                rightValue={values[`address_${id}`]}
                rightOnChange={onChange(`address_${id}`)}
                rightOnBlur={onBlur(`address_${id}`)}
                rightErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                _rightInputStyles={!!values[`address_${id}`] ? {
                  fontFamily: 'Martian',
                  fontWeight: 600,
                  fontSize: '14px'
                }: {}}
                _rightContainerStyles={{ width: '70%', minWidth: '520px' }}
                leftAutoFocus={id === guardianIds[0]}
                leftPlaceholder="Name"
                leftValue={values[`name_${id}`]}
                leftOnChange={onChange(`name_${id}`)}
                leftOnBlur={onBlur(`name_${id}`)}
                leftErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
                leftComponent={<Text color="#898989" fontWeight="600">eth:</Text>}
                _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                onEnter={handleSubmit}
                _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}

              />
              {i > 0 && (
                <Box
                  onClick={() => removeGuardian(id)}
                  position="absolute"
                  width="40px"
                  right="-40px"
                  top="0"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <Icon src={MinusIcon} />
                </Box>
              )}
            </Box>
          ))}
          <TextButton onClick={() => addGuardian()} color="#EC588D" _hover={{ color: "#EC588D" }}>
            <PlusIcon color="#EC588D" />
            <Text marginLeft="5px">Add more guardians</Text>
          </TextButton>
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <TextBody>Wallet recovery requires</TextBody>
        <Box width="80px" margin="0 10px">
          <Menu>
            <MenuButton
              px={2}
              py={2}
              width="80px"
              transition="all 0.2s"
              borderRadius="16px"
              borderWidth="1px"
              padding="12px"
              _hover={{
                borderColor: '#3182ce',
                boxShadow: '0 0 0 1px #3182ce'
              }}
              _expanded={{
                borderColor: '#3182ce',
                boxShadow: '0 0 0 1px #3182ce'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">{amountForm.values.amount}<DropDownIcon /></Box>
            </MenuButton>
            <MenuList>
              {!amountData.guardiansCount && <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>0</MenuItem>}
              {!!amountData.guardiansCount && getNumberArray(amountData.guardiansCount || 0).map((i: any) =>
                <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>{i}</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
        <TextBody>out of {amountData.guardiansCount || 0} guardian(s) confirmation. </TextBody>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
        <Button
          disabled={disabled}
          loading={loading}
          onClick={handleSubmit}
          _styles={{ width: '455px' }}
        >
          Continue
        </Button>
        {textButton}
      </Box>
    </Fragment>
  );
}
