import React, { useState, useRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { ethers } from "ethers";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import MinusIcon from "@src/assets/icons/minus.svg";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { useGlobalStore } from "@src/store/global";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";
import Icon from "@src/components/Icon";
import { nextRandomId } from "@src/lib/tools";
import WarningIcon from "@src/components/Icons/Warning";

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

const amountValidate = () => {
  return {}
}

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeystore();
  const { generateWalletAddress } = useWallet();
  const { updateFinalGuardians } = useGlobalStore();
  const [showTips, setShowTips] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds))
  const [guardiansList, setGuardiansList] = useState([])

  const { values, errors, invalid, onChange, onBlur, showErrors, addField, removeField } = useForm({
    fields,
    validate
  })


  const disabled = invalid || !guardiansList.length

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate
  })

  useEffect(() => {
    setGuardiansList(Object.keys(values).filter(key => key.indexOf('address') === 0).map(key => values[key]).filter(address => !!String(address).trim().length) as any)
  }, [values])
  console.log('values', values)

  // const { guardians, updateErrorMsgById, addGuardian } = createGuardianStore({ guardians: [] })

  const handleSubmit = async () => {
    const guardiansList = Object.keys(values).filter(key => key.indexOf('address') === 0).map(key => values[key]).filter(address => !!String(address).trim().length)
    const eoaAddress = keystore.keystore.L1KeyStoreContractAddress
    const walletAddress = await generateWalletAddress(eoaAddress, guardiansList, true);
    console.log('handleSubmit', eoaAddress, guardiansList, walletAddress)

    handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    /* return new Promise((resolve, reject) => {
     *   const addressList: string[] = [];

     *   for (let i = 0; i < guardians.length; i++) {
     *     if (guardians[i].address.length && addressList.includes(guardians[i].address)) {
     *       updateErrorMsgById(guardians[i].id, "Duplicate address");
     *       return reject("Duplicate address");
     *     }
     *     if (!ethers.utils.isAddress(guardians[i].address)) {
     *       updateErrorMsgById(guardians[i].id, "Invalid address");
     *       return reject("Invalid address");
     *     }
     *     addressList.push(guardians[i].address);
     *   }

     *   return resolve(guardians);
     * }); */
  }

  const addGuardian = () => {
    const id = nextRandomId()
    const newGuardianIds = [...guardianIds, id]
    const newFields = getFieldsByGuardianIds(newGuardianIds)
    setGuardianIds(newGuardianIds)
    setFields(newFields)

    for (const newField of newFields) {
      addField(newField)
    }
  };

  const removeGuardian = (deleteId: string) => {
    if (guardianIds.length > 1) {
      const newGuardianIds = guardianIds.filter(id => id !== deleteId)
      const newFields = getFieldsByGuardianIds(newGuardianIds)
      setGuardianIds(newGuardianIds)
      setFields(newFields)

      const deleteFields = getFieldsByGuardianIds(deleteId)

      for (const newField of deleteFields) {
        removeField(newField)
      }
    }
  }

  const handleAddGuardian = () => {
    // addGuardian();
  };

  const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const handleNext = async () => {
    try {
      /* const guardianList = (await formRef.current?.submit()) as GuardianItem[];
       * if (guardianList?.length === 0) {
       *   return;
       * }
       * updateFinalGuardians(guardianList);

       * const eoaAddress = await keystore.getAddress();

       * const guardianAddress = guardianList.map((item) => item.address);

       * generateWalletAddress(eoaAddress, guardianAddress, true);
       */
      handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = () => {
    setSkipping(true)
    /* updateFinalGuardians([]);
     * const eoaAddress = await keystore.getAddress();
     * generateWalletAddress(eoaAddress, [], true);
     * handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault); */
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  const handleDelete = () => {
    // removeGuardian(id);
  };

  if (skipping) {
    return (
      <Box maxWidth="400px">
        <Box background="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="20px" paddingBottom="0" borderRadius="16px">
          <Box marginBottom="1em"><WarningIcon /></Box>
          <Heading3 width="100%">What if I don’t set up guardian now?</Heading3>
          <TextBody width="100%" marginBottom="1em">Guardians are required to recover your wallet in the case of loss or theft. You can learn more here</TextBody>
          <Heading3 width="100%">Can I set guardians in the future?</Heading3>
          <TextBody width="100%" marginBottom="1em">Yes. You can setup or change your guardians anytime on your home page.</TextBody>
          <Button width="100%" onClick={() => setSkipping(false)}>Set guardians now</Button>
          <TextButton width="100%" onClick={() => handleJumpToTargetStep(CreateStepEn.SaveGuardianList)}>I understand the risks, skip for now</TextButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>Set Guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show more</Text>
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
          {(guardianIds).map((id: any) => (
            <Box position="relative" width="100%" key={id}>
              <DoubleFormInput
                leftPlaceholder="Enter guardian address"
                leftValue={values[`address_${id}`]}
                leftOnChange={onChange(`address_${id}`)}
                leftOnBlur={onBlur(`address_${id}`)}
                leftErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                rightPlaceholder="Assign nickname"
                rightValue={values[`name_${id}`]}
                rightOnChange={onChange(`name_${id}`)}
                rightOnBlur={onBlur(`name_${id}`)}
                rightErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
                _styles={{ width: '100%' }}
              />
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
            </Box>
          ))}
          <TextButton onClick={() => addGuardian()} color="#EC588D">
            Add More Guardian
          </TextButton>
        </Box>
        <TextBody marginTop="0.75em" marginBottom="0.75em" textAlign="center">
          Set number of guardian signatures required to recover if you lose access to your wallet. We recommend requiring at least X for safety.
        </TextBody>
        <SmallFormInput
          placeholder="Enter amount"
          value={amountForm.values.amount}
          onChange={amountForm.onChange('amount')}
          RightComponent={<Text fontWeight="bold">/ 3</Text>}
          _styles={{ width: '180px', marginTop: '0.75em' }}
        />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
        <Button
          disabled={disabled}
          onClick={handleSubmit}
          _styles={{ width: '455px' }}
        >
          Continue
        </Button>
        <TextButton
          color="rgb(137, 137, 137)"
          onClick={handleSkip}
          _styles={{ width: '455px' }}
        >
          Skip for now
        </TextButton>
      </Box>
    </Box>
  );
}
