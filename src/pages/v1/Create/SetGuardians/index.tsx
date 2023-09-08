import React, { useState, useRef, useImperativeHandle, useCallback, useEffect } from 'react';
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
import { Box, Text, Image, useToast, Select } from "@chakra-ui/react"
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

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeystore();
  const { calcGuardianHash } = useKeystore()
  const [showTips, setShowTips] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds))
  const [guardiansList, setGuardiansList] = useState([])
  const [amountData, setAmountData] = useState<any>({})
  const {account} = useWalletContext();
  const {calcWalletAddress} = useSdk();
  const { selectedAddress, setSelectedAddress, addAddressItem, setAddressList } = useAddressStore();
  const { setGuardians, setGuardianNames, setThreshold, setSlotInitInfo, setSlot } = useGuardianStore();
  const toast = useToast()
  const {chainConfig} = useConfig();

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

    try {
      setLoading(true)

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

      setGuardians(guardianAddresses)
      setGuardianNames(guardianNames)
      setThreshold(threshold)
      setLoading(false)
      handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    } catch (error: any) {
      setLoading(false)
      toast({
        title: error.message,
        status: "error",
      })
    }
  }

  const createInitialWallet = async () => {
    const keystore = chainConfig.contracts.l1Keystore
    const initialKey = ethers.zeroPadValue(account, 32)
    const guardianHash = calcGuardianHash([], 0)
    const initialGuardianHash = guardianHash
    let initialGuardianSafePeriod = L1KeyStore.days * 2
    initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)

    const slotInitInfo = {
      initialKey,
      initialGuardianHash,
      initialGuardianSafePeriod
    }
    const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod)
    setSlotInitInfo(slotInitInfo)
    setSlot(slot)

    const newAddress = await calcWalletAddress(0);
    const walletName = `Account 1`
    setAddressList([{ title: walletName, address: newAddress, activatedChains: [], activatingChains: [], allowedOrigins: [] }])
    console.log('createInitialWallet', newAddress)
    setSelectedAddress(newAddress)
  }

  const handleSkip = async () => {
    try {
      setLoading(true)

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

      setGuardians(guardianAddresses)
      setGuardianNames(guardianNames)
      setThreshold(threshold)
      await createInitialWallet()
      setLoading(false)
      handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault);
    } catch (error: any) {
      setLoading(false)
      toast({
        title: error.message,
        status: "error",
      })
    }
  }
  console.log('selectedAddress', selectedAddress, amountForm)

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

  const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const handleNext = async () => {
    try {
      handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    } catch (err) {
      console.error(err);
    }
  };

  const onSkip = () => {
    setSkipping(true)
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  const handleDelete = () => {
    // removeGuardian(id);
  };

  const selectAmount = (event: any) => {
    if (event.target.value) {
      amountForm.onChange('amount')(Number(event.target.value))
    }
  }

  useEffect(() => {
    if (!amountForm.values.amount || (Number(amountForm.values.amount) > amountData.guardiansCount)) {
      amountForm.onChange('amount')(getRecommandCount(amountData.guardiansCount))
    }
  }, [amountData.guardiansCount, amountForm.values.amount])

  if (skipping) {
    return (
      <Box maxWidth="480px">
        <Box background="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="32px 80px" borderRadius="16px">
          <Box marginBottom="1em"><WarningIcon /></Box>
          <Heading3 width="100%">What if I don’t set up guardian now?</Heading3>
          <TextBody width="100%" marginBottom="1em">Guardians are required to recover your wallet in the case of loss or theft. You can learn more here</TextBody>
          <Heading3 width="100%">Can I set guardians in the future?</Heading3>
          <TextBody width="100%" marginBottom="1em">Yes. You can setup or change your guardians anytime on your home page.</TextBody>
          <Button width="100%" onClick={() => setSkipping(false)}>Set guardians now</Button>
          <TextButton loading={loading} width="100%" disabled={loading} onClick={handleSkip}>
            {loading && 'skipping'}
            {!loading && 'I understand the risks, skip for now'}
          </TextButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Heading1>Set guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show {showTips ? 'less' : 'more'}</Text>
        </TextBody>
      </Box>
      {showTips && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em" marginTop="1.5em">
          <Box>
            <Heading3 marginBottom="0.75em">What is a guardian?</Heading3>
            <TextBody marginBottom="1em">
              Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces seed phrases with guardian-signature social recovery, improving security and usability.
            </TextBody>

            <Heading3 marginBottom="0.75em">What wallet can be set as guardian?</Heading3>
            <TextBody marginBottom="1em">
              You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as one of your guardians, ensure it's currently setup on Ethereum for social recovery.
            </TextBody>

            <Heading3 marginBottom="0.75em">What is wallet recovery?</Heading3>
            <TextBody marginBottom="1em">
              If your Soul Wallet is lost or stolen, social recovery help you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
            </TextBody>
            <TextBody marginBottom="1em">
              After successfully recovering your wallet, your guardians' addresses will be visible on-chain. To maintain privacy, consider changing your guardian list after you complete a recovery.
            </TextBody>
          </Box>
        </Box>
      )}
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
          <Select icon={<DropDownIcon />} width="80px" borderRadius="16px" value={amountForm.values.amount} onChange={selectAmount}>
            {!amountData.guardiansCount && <option key={nanoid(4)} value={0}>0</option>}
            {!!amountData.guardiansCount && getNumberArray(amountData.guardiansCount || 0).map((i: any) =>
              <option key={nanoid(4)} value={i}>{i}</option>
            )}
          </Select>
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
        <TextButton
          color="rgb(137, 137, 137)"
          onClick={onSkip}
          _styles={{ width: '455px' }}
        >
          Skip for now
        </TextButton>
      </Box>
    </Box>
  );
}
