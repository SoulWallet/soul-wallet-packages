import React, { useState, useRef, useEffect, Fragment } from 'react';
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, GuardiansStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useKeyring from "@src/hooks/useKeyring";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem } from "@chakra-ui/react"
import { copyText, nextRandomId } from "@src/lib/tools";
import useConfig from "@src/hooks/useConfig";
import { L1KeyStore } from "@soulwallet/sdk";
import { useAddressStore } from "@src/store/address";
import { useGuardianStore } from "@src/store/guardian";
import useSdk from '@src/hooks/useSdk';
import useWalletContext from '@src/context/hooks/useWalletContext';
import { ethers } from "ethers";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import useKeystore from "@src/hooks/useKeystore";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import ArrowRightIcon from "@src/components/Icons/ArrowRight";
import DropDownIcon from "@src/components/Icons/DropDown";
import PlusIcon from "@src/components/Icons/Plus";
import MinusIcon from "@src/assets/icons/minus.svg";
import Icon from "@src/components/Icon";
import useForm from "@src/hooks/useForm";
import config from "@src/config";
import { nanoid } from "nanoid";

const getNumberArray = (count: number) => {
  const arr = []

  for (let i = 1; i <= count; i++) {
    arr.push(i)
  }

  return arr
}

const checkPaid = (activeGuardiansInfo: any) => {
  if (activeGuardiansInfo) {
    if (activeGuardiansInfo.guardianActivateAt) {
      return true
    }
  }

  return false
}

const checkPending = (activeGuardiansInfo: any) => {
  if (activeGuardiansInfo) {
    if (activeGuardiansInfo.pendingGuardianHash && activeGuardiansInfo.activeGuardianHash === activeGuardiansInfo.guardianHash) {
      return true
    }
  }

  return false
}

const checkFinished = (activeGuardiansInfo: any) => {
  if (activeGuardiansInfo) {
    if (!activeGuardiansInfo.guardianActivateAt) {
      return true
    } else if (activeGuardiansInfo.pendingGuardianHash && activeGuardiansInfo.activeGuardianHash === activeGuardiansInfo.pendingGuardianHash && (Number(activeGuardiansInfo.guardianActivateAt) * 1000 < Date.now())) {
      return true
    }

    return false
  } else {
    return true
  }
}

const defaultGuardianIds = [nextRandomId(), nextRandomId(), nextRandomId()]

const isGuardiansEmpty = (guardians: any, guardianNames: any, threshold: any) => {
  if ((!guardians || guardians.length === 0) && (!guardianNames || guardianNames.length === 0) && (!threshold || threshold === 0)) {
    return true
  }

  return false
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

const TipsInfo = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em" marginTop="1.5em" maxWidth="500px">
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
  )
}

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const { calcGuardianHash, getReplaceGuardianInfo, getCancelSetGuardianInfo, getActiveGuardianHash } = useKeystore()
  const [showTips, setShowTips] = useState(false)
  const [showStatusTips, setShowStatusTips] = useState(false)

  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds))
  const [guardiansList, setGuardiansList] = useState([])
  const [amountData, setAmountData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [replaced, setReplaced] = useState(false)
  // const [canceling, setCanceling] = useState(false)
  const [paymentRequesting, setPaymentRequesting] = useState(false)
  const [updatingInfo, setUpdatingInfo] = useState<any>(null)
  const [reediting, setReediting] = useState(false)
  const [paymentParems, setPaymentParems] = useState<any>(null)
  const [paymentCancelParems, setPaymentCancelParems] = useState<any>(null)
  const [activeGuardiansInfo, setActiveGuardiansInfo] = useState<any>(null)

  const { account } = useWalletContext();
  const { calcWalletAddress } = useSdk();
  const { selectedAddress, setSelectedAddress, addAddressItem, setAddressList } = useAddressStore();
  const {
    guardians,
    guardianNames,
    threshold,

    setGuardians,
    setGuardianNames,
    setThreshold,

    editingGuardians,
    editingGuardianNames,
    editingThreshold,
    isEditing,

    setEditingGuardians,
    setEditingGuardianNames,
    setEditingThreshold,
    setIsEditing,

    editingGuardiansInfo,
    setEditingGuardiansInfo,
    cancelEditingGuardiansInfo,
    setCancelEditingGuardiansInfo
  } = useGuardianStore();
  const toast = useToast()
  const { chainConfig } = useConfig();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields, clearFields } = useForm({
    fields,
    validate
  })

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount || 0)
    }
  })

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading

  useEffect(() => {
    setGuardiansList(Object.keys(values).filter(key => key.indexOf('address') === 0).map(key => values[key]).filter(address => !!String(address).trim().length) as any)
  }, [values])

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length })
  }, [guardiansList])

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

  const handleJumpToTargetStep = (targetStep: GuardiansStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const getActiveGuardiansHash = async () => {
    const result = await getActiveGuardianHash()
    setActiveGuardiansInfo(result)
    setLoaded(true)
    /* const guardianActivateAt = result.guardianActivateAt

     * if (guardianActivateAt && guardianActivateAt * 1000 < Date.now()) {
     *   console.log('finished')
     * }

     * console.log('getActiveGuardiansHash', result, result && result.guardianActivateAt, Date.now())
     * if (result && result.guardianActivateAt) {
     *   onUpdateSuccess()
     * } */
  }

  useEffect(() => {
    getActiveGuardiansHash()

    setInterval(() => {
      getActiveGuardiansHash()
    }, 5000)
    // setCancelEditingGuardiansInfo(null)
  }, [])

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

      const guardianAddresses = guardiansList.map((item: any) => item.address)
      const guardianNames = guardiansList.map((item: any) => item.name)
      const threshold = amountForm.values.amount || 0
      const guardianHash = calcGuardianHash(guardianAddresses, threshold)
      const replaceGuardiansInfo: any = await getReplaceGuardianInfo(guardianHash)

      console.log('guardianAddresses', guardianAddresses)
      console.log('guardianNames', guardianNames)
      console.log('threshold', threshold)
      console.log('guardianHash', guardianHash)
      console.log('replaceGuardiansInfo', replaceGuardiansInfo)

      if (replaceGuardiansInfo.keySignature) {
        setEditingGuardiansInfo(replaceGuardiansInfo)
        setPaymentParems(replaceGuardiansInfo)
        setPaymentRequesting(true)
        setEditingGuardians(guardianAddresses)
        setEditingGuardianNames(guardianNames)
        setEditingThreshold(threshold)
        setCancelEditingGuardiansInfo(null)
        clearFields(getFieldsByGuardianIds(guardianIds))
        amountForm.clearFields(['amount'])
        setIsEditing(true)
      }

      setReediting(false)
      setLoading(false)
      // handleJumpToTargetStep(GuardiansStepEn.Save);
    } catch (error: any) {
      setLoading(false)
      toast({
        title: error.message,
        status: "error",
      })
    }
  }

  const handleNext = async () => {
    handleJumpToTargetStep(GuardiansStepEn.Save);
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  const toggleStatusTips = (event: any) => {
    console.log('toggleStatusTips', event)
    setShowStatusTips(!showStatusTips)
  }

  const handleCancel = async () => {
    try {
      setCanceling(true)
      const cancelSetGuardianInfo: any = await getCancelSetGuardianInfo()
      console.log('cancelSetGuardianInfo', cancelSetGuardianInfo)
      setCancelEditingGuardiansInfo(cancelSetGuardianInfo)
      setCanceling(false)
      setEditingGuardiansInfo(null)
      setIsEditing(false)
      /*
       *       toast({
       *         title: "Copy success!",
       *         status: "success",
       *       }); */
    } catch (error: any) {
      setCanceling(false)
      toast({
        title: error.message,
        status: "error",
      })
    }
  }

  const copyPayCancelLink = async () => {
    try {
      if (cancelEditingGuardiansInfo && cancelEditingGuardiansInfo.keySignature) {
        const url = `${config.officialWebUrl}/pay-cancel-edit-guardians/${cancelEditingGuardiansInfo.slot}?keySignature=${cancelEditingGuardiansInfo.keySignature}&slot=${cancelEditingGuardiansInfo.slot}`
        copyText(url)

        toast({
          title: "Copy success!",
          status: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
      })
    }
  };

  const copyPayLink = async () => {
    const params = paymentParems || editingGuardiansInfo

    if (params) {
      const url = `${config.officialWebUrl}/pay-edit-guardians/${params.newGuardianHash}?newGuardianHash=${params.newGuardianHash}&keySignature=${params.keySignature}&initialKey=${params.initialKey}&initialGuardianHash=${params.initialGuardianHash}&initialGuardianSafePeriod=${params.initialGuardianSafePeriod}`

      copyText(url)

      toast({
        title: "Copy success!",
        status: "success",
      });
    }
  };

  const replaceGuardians = async () => {
    setGuardians(editingGuardians)
    setGuardianNames(editingGuardianNames)
    setThreshold(editingThreshold)

    setEditingGuardiansInfo(null)
    setEditingGuardians([])
    setEditingGuardianNames([])
    setEditingThreshold(0)
    setCancelEditingGuardiansInfo(null)
    setIsEditing(false)
  }

  const selectAmount = (amount: any) => () => {
    amountForm.onChange('amount')(amount)
  }

  useEffect(() => {
    // console.log('amountData.guardiansCount', amountData.guardiansCount, amountForm.values.amount)
    if (!amountForm.values.amount || (Number(amountForm.values.amount) > amountData.guardiansCount)) {
      amountForm.onChange('amount')(getRecommandCount(amountData.guardiansCount))
    }
  }, [amountData.guardiansCount, amountForm.values.amount])

  const isGuardiansNotSet = isGuardiansEmpty(guardians, guardianNames, threshold)
  const isPaid = checkPaid(activeGuardiansInfo)
  const isPending = checkPending(activeGuardiansInfo)
  const isFinished = checkFinished(activeGuardiansInfo)
  console.log('activeGuardiansInfo', activeGuardiansInfo, isPaid, isPending, isFinished)
  console.log('shouldReplace', isFinished, isEditing, editingGuardiansInfo)

  if (isFinished && isEditing && false) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
        <Heading1 _styles={{ marginBottom: '20px' }}>Edit guardians success</Heading1>
        {replaced ? (
          <Button
            disabled={true}
            _styles={{ width: '100%' }}
          >
            Replaced
          </Button>
        ): (
          <Button
            disabled={false}
            onClick={replaceGuardians}
            _styles={{ width: '100%' }}
          >
            Replace Guardians
          </Button>
        )}
      </Box>
    )
  }

  if (!loaded) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading1>
          Loading...
        </Heading1>
      </Box>
    )
  }

  if (editingGuardiansInfo && !isPaid) {
    return (
      <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading1>
          Request Payment
        </Heading1>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center">

          </TextBody>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
          <Button
            onClick={copyPayLink}
            _styles={{ width: '455px' }}
          >
            Copy Pay Link
          </Button>
        </Box>
      </Box>
    )
  }

  if (isPending && !isFinished) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading1>
          Discard Change
        </Heading1>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center">
            New guardians updating in {new Date(activeGuardiansInfo.guardianActivateAt * 1000).toLocaleString()}
            {showStatusTips && (
              <Text>
                {`You have a pending update, and it can be canceled before the time above runs out. To cancel this pending update, click "Discard Changes" below.`}
              </Text>
            )}
            <Text onClick={toggleStatusTips} color="#EC588D" cursor="pointer">Show {showStatusTips ? 'less' : 'more'}</Text>
          </TextBody>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
          {!cancelEditingGuardiansInfo && (
            <Button
              disabled={canceling}
              loading={canceling}
              onClick={handleCancel}
              _styles={{ width: '455px' }}
            >
              Discard Change
            </Button>
          )}
          {cancelEditingGuardiansInfo && (
            <Button
              onClick={copyPayCancelLink}
              _styles={{ width: '455px' }}
            >
              Copy Pay Link
            </Button>
          )}
        </Box>
        {!reediting && (
          <Box display="flex" flexDirection="column" alignItems="center" marginTop="300px">
            <TextButton
              color="rgb(137, 137, 137)"
              onClick={() => setReediting(true)}
              _styles={{ width: '455px', cursor: 'pointer' }}
            >
              Edit Guardians
              <Text marginLeft="5px"><ArrowRightIcon color="rgb(137, 137, 137)" /></Text>
            </TextButton>
            <TextButton
              color="rgb(137, 137, 137)"
              onClick={handleNext}
              _styles={{ width: '455px' }}
            >
              Backup current guardians
            </TextButton>
          </Box>
        )}
        {reediting && (
          <Box display="flex" flexDirection="column" alignItems="center" marginTop="40px">
            <Text fontSize="24px" fontWeight="800" marginBottom="10px" color="#1E1E1E" cursor="pointer"  onClick={() => setReediting(false)} display="flex" alignItems="center" justifyContent="flex-start">
              <Text>Edit guardians</Text>
              <Text marginLeft="10px" transform="rotate(90deg)"><ArrowRightIcon /></Text>
            </Text>
            <Box marginBottom="0.75em">
              <TextBody textAlign="center">
                Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show {showTips ? 'less' : 'more'}</Text>
              </TextBody>
            </Box>
            {showTips && <TipsInfo />}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em" width="100%">
                {(guardianIds).map((id: any, i: number) => (
                  <Box position="relative" width="100%" key={id}>
                    <DoubleFormInput
                      onEnter={handleSubmit}
                      _styles={{ width: '100%' }}
                      _rightInputStyles={!!values[`address_${id}`] ? {
                        fontFamily: "Martian",
                        fontWeight: 600,
                      }: {}}
                      leftPlaceholder="Guardian address"
                      leftValue={values[`address_${id}`]}
                      leftOnChange={onChange(`address_${id}`)}
                      leftOnBlur={onBlur(`address_${id}`)}
                      leftErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                      leftAutoFocus={id === guardianIds[0]}
                      rightPlaceholder="Name"
                      rightValue={values[`name_${id}`]}
                      rightOnChange={onChange(`name_${id}`)}
                      rightOnBlur={onBlur(`name_${id}`)}
                      rightErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
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
                <TextButton onClick={() => addGuardian()} color="#EC588D">
                  <PlusIcon color="#EC588D" />
                  <Text marginLeft="4px">Add more guardians</Text>
                </TextButton>
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
                onClick={handleNext}
                _styles={{ width: '455px' }}
              >
                Backup current guardians
              </TextButton>
            </Box>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      {!!isGuardiansNotSet && (
        <Heading1>
          Set guardians
        </Heading1>
      )}
      {!isGuardiansNotSet && (
        <Heading1>
          Edit guardians
        </Heading1>
      )}
      <Box marginBottom="0.75em" maxWidth="500px">
        <TextBody textAlign="center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show {showTips ? 'less' : 'more'}</Text>
        </TextBody>
      </Box>
      {showTips && <TipsInfo />}
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
          <TextButton
            onClick={() => addGuardian()}
            color="#EC588D"
            _hover={{ color: "#EC588D" }}
          >
            <PlusIcon color="#EC588D" />
            <Text marginLeft="4px">Add more guardians</Text>
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
        <TextButton
          color="rgb(137, 137, 137)"
          onClick={handleNext}
          _styles={{ width: '455px' }}
        >
          Backup current guardians
        </TextButton>
      </Box>
    </Box>
  );
}
