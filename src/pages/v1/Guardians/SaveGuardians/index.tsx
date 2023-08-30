import React, { useEffect, useState } from "react";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import { useGlobalStore } from "@src/store/global";
import { Box, Text, Image, useToast } from "@chakra-ui/react"
import useTools from "@src/hooks/useTools";
import useSdk from '@src/hooks/useSdk';
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import IconButton from "@src/components/web/IconButton";
import WarningIcon from "@src/components/Icons/Warning";
import DownloadIcon from '@src/components/Icons/Download'
import SendIcon from '@src/components/Icons/Send'
import useForm from "@src/hooks/useForm";
import useWalletContext from '@src/context/hooks/useWalletContext';
import { useAddressStore } from "@src/store/address";
import { useGuardianStore } from "@src/store/guardian";
import useKeystore from "@src/hooks/useKeystore";
import { L1KeyStore } from "@soulwallet/sdk";
import config from "@src/config";
import api from "@src/lib/api";
import { ethers } from "ethers";
import useConfig from "@src/hooks/useConfig";

const toHex = (num: any) => {
  let hexStr = num.toString(16)

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr
  }

  hexStr = '0x' + hexStr

  return hexStr
}

const validate = (values: any) => {
  const errors: any = {}
  const { email } = values

  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

const SaveGuardians = () => {
  const [hasSaved, setHasSaved] = useState(false);
  const { downloadJsonFile, emailJsonFile, formatGuardianFile } = useTools();
  // const { guardians } = useGlobalStore();
  const [email, setEmail] = useState<string>();
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [sended, setSended] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { account } = useWalletContext();
  const { guardians, guardianNames, threshold, setSlotInitInfo } = useGuardianStore();
  const { setSelectedAddress, setAddressList } = useAddressStore();
  const { calcGuardianHash, getSlot } = useKeystore()
  const {chainConfig} = useConfig();
  const { calcWalletAddress } = useSdk();
  const toast = useToast()

  const emailForm = useForm({
    fields: ['email'],
    validate
  })

  const dispatch = useStepDispatchContext();

  const handleNext = async () => {
    setCreating(true)
    await createInitialWallet()
    setCreating(false)

    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: CreateStepEn.SetSoulWalletAsDefault,
    });
  };

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    const walletName = `Account 1`
    setAddressList([{ title: walletName, address: newAddress, activatedChains: [], allowedOrigins: [] }])
    console.log('createInitialWallet', newAddress)
    setSelectedAddress(newAddress)
  }

  const handleBackupGuardians = async () => {
    try {
      setLoading(true)
      const keystore = chainConfig.contracts.l1Keystore
      const initialKey = ethers.zeroPadValue(account, 32)
      const guardianHash = calcGuardianHash(guardians, threshold)
      console.log('guardianHash', guardians, threshold, guardianHash)
      const initialGuardianHash = guardianHash
      const salt = ethers.ZeroHash
      let initialGuardianSafePeriod = L1KeyStore.days * 2
      initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
      const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
      const slotInitInfo = {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }

      const params = {
        keystore,
        guardianHash,
        guardianDetails: {
          guardians,
          threshold,
          salt
        },
        slot,
        slotInitInfo
      }

      const result = await api.guardian.backup(params)
      setSlotInitInfo(slotInitInfo)
      setLoading(false)
      setLoaded(true)
      toast({
        title: "OnChain Backup Success!",
        status: "success",
      })
      console.log('handleBackupGuardians', result)
    } catch (e: any) {
      setLoading(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true)
      const email = emailForm.values.email

      if (!email) {

      }

      const date = new Date()
      const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-guardian.json`
      const keystore = chainConfig.contracts.l1Keystore
      const initialKey = ethers.zeroPadValue(account, 32)
      const guardianHash = calcGuardianHash(guardians, threshold)
      const initialGuardianHash = guardianHash
      const salt = ethers.ZeroHash
      let initialGuardianSafePeriod = L1KeyStore.days * 2
      initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
      const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
      // guardianNames
      const slotInitInfo = {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }

      const params = {
        email,
        filename,
        keystore,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians,
          threshold,
          salt
        },
        slot,
        slotInitInfo
      }

      const result = await api.guardian.emailBackup(params)
      setSlotInitInfo(slotInitInfo)
      setSending(false)
      setSended(true)
      toast({
        title: "Email Backup Success!",
        status: "success",
      })
      console.log('handleEmailBackupGuardians', params, result)
    } catch (e: any) {
      setSending(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true)
      const date = new Date()
      const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-guardian.json`
      const keystore = chainConfig.contracts.l1Keystore
      const initialKey = ethers.zeroPadValue(account, 32)
      const guardianHash = calcGuardianHash(guardians, threshold)
      const initialGuardianHash = guardianHash
      const salt = ethers.ZeroHash
      let initialGuardianSafePeriod = L1KeyStore.days * 2
      initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
      const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
      // guardianNames
      const slotInitInfo = {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }

      const params = {
        filename,
        keystore,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians,
          threshold,
          salt
        },
        slot,
        slotInitInfo
      }

      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(params))}`
      const link = document.createElement("a")
      link.setAttribute("href", dataStr)
      link.setAttribute("target", "_blank")
      link.setAttribute("download", filename)
      link.click()

      setSlotInitInfo(slotInitInfo)
      setDownloading(false)
      setDownloaded(true)
    } catch (e: any) {
      setDownloading(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Heading1>Backup Guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody fontSize="0.875em" textAlign="center" maxWidth="500px">
          Make sure to save your list of guardians for social recovery. Choose at least one method below to keep this list safe.
        </TextBody>
      </Box>
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box
          width="400px"
          borderRight={{ base: 'none', md: '1px solid #D7D7D7' }}
          padding="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Heading3>Save by yourself</Heading3>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              If you choose to store your own guardian list, make you save the file and remember it's location as it will be needed for future wallet recovery.
            </TextBody>
          </Box>
          <Button onClick={handleDownloadGuardians} disabled={downloading} loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }} LeftIcon={<DownloadIcon />}>
            Download to Local
          </Button>
          <TextBody marginTop="0.75em">Or</TextBody>
          <FormInput
            label=""
            placeholder="Send to Email"
            value={emailForm.values.email}
            errorMsg={emailForm.showErrors.email && emailForm.errors.email}
            onChange={emailForm.onChange('email')}
            onBlur={emailForm.onBlur('email')}
            _styles={{ width: '100%', marginTop: '0.75em' }}
            onEnter={handleEmailBackupGuardians}
            RightIcon={(
              <IconButton
                onClick={handleEmailBackupGuardians}
                disabled={sending || !(emailForm.values.email)}
                loading={sending}
              >
                {!(emailForm.values.email) && <SendIcon opacity="0.4" />}
                {!!(emailForm.values.email) && <SendIcon color={'#EE3F99'} />}
              </IconButton>
            )}
          />
        </Box>
        <Box width="400px" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading3>Save with Soul Wallet</Heading3>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              Soul Wallet can store your list encrypted on-chain, but you still need to remember your wallet address for recovery.
            </TextBody>
          </Box>
          <Button disabled={loading} loading={loading} _styles={{ width: '100%' }} onClick={handleBackupGuardians}>
            Store On-chain
          </Button>
        </Box>
      </Box>
      <Button disabled={!(loaded || downloaded || sended) || creating} onClick={handleNext} loading={creating} _styles={{ width: '359px', marginTop: '0.75em' }}>
        Continue
      </Button>
    </Box>
  )
};

export default SaveGuardians;
