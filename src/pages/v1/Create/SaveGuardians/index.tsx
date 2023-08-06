import React, { useEffect, useState } from "react";
import { SButton } from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import { useGlobalStore } from "@src/store/global";
import { Box, Text, Image } from "@chakra-ui/react"
import useTools from "@src/hooks/useTools";
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
  const [downloaded, setDownloaded] = useState(false);
  const [sended, setSended] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { account } = useWalletContext();
  const { selectedAddressItem } = useAddressStore();
  const { guardians, guardianNames, threshold } = useGuardianStore();
  const { calcGuardianHash, getSlot } = useKeystore()

  const emailForm = useForm({
    fields: ['email'],
    validate
  })

  const handleDownload = async () => {
    setDownloading(true);

    const walletAddress = await getLocalStorage("walletAddress");

    const jsonToSave = formatGuardianFile(walletAddress, guardians as any);

    downloadJsonFile(jsonToSave);

    setDownloading(false);

    // onSave();
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
  };

  const handleSendEmail = async () => {
    if (!email) {
      return;
    }
    setSending(true);

    try {
      const walletAddress = await getLocalStorage("walletAddress");
      const jsonToSave = formatGuardianFile(walletAddress, guardians as any);
      const res: any = await emailJsonFile(jsonToSave, email);

      if (res.code === 200) {
        // onSave();
      }
    } catch {
      // maybe toast error message?
    } finally {
      setSending(false);
    }
  };

  const dispatch = useStepDispatchContext();

  const handleSaved = () => {
    setHasSaved(true);
  };

  const handleNext = () => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: CreateStepEn.SetSoulWalletAsDefault,
    });
  };

  const handleBackupGuardians = async () => {
    setLoading(true)
    const keystore = config.contracts.l1Keystore
    const initialKey = ethers.zeroPadValue(account, 32)
    const guardianHash = calcGuardianHash(guardians, threshold)
    const initialGuardianHash = guardianHash
    const salt = ethers.ZeroHash
    let initialGuardianSafePeriod = L1KeyStore.days * 2
    initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
    const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);


    const params = {
      keystore,
      guardianHash,
      guardianDetails: {
        guardians,
        threshold,
        salt
      },
      slot,
      slotInitInfo: {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }
    }

    const result = await api.guardian.backup(params)
    setLoading(false)
    setLoaded(true)
    console.log('handleBackupGuardians', result)
  };

  const handleEmailBackupGuardians = async () => {
    setSending(true)
    const email = emailForm.values.email

    if (!email) {

    }

    const date = new Date()
    const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-guardian.json`
    const keystore = config.contracts.l1Keystore
    const initialKey = ethers.zeroPadValue(account, 32)
    const guardianHash = calcGuardianHash(guardians, threshold)
    const initialGuardianHash = guardianHash
    const salt = ethers.ZeroHash
    let initialGuardianSafePeriod = L1KeyStore.days * 2
    initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
    const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
    // guardianNames

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
      slotInitInfo: {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }
    }

    const result = await api.guardian.emailBackup(params)
    setSending(false)
    setSended(true)
    console.log('handleEmailBackupGuardians', params, result)
  };

  const handleDownloadGuardians = async () => {
    setDownloading(true)
    const date = new Date()
    const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-guardian.json`
    const keystore = config.contracts.l1Keystore
    const initialKey = ethers.zeroPadValue(account, 32)
    const guardianHash = calcGuardianHash(guardians, threshold)
    const initialGuardianHash = guardianHash
    const salt = ethers.ZeroHash
    let initialGuardianSafePeriod = L1KeyStore.days * 2
    initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any)
    const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
    // guardianNames

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
      slotInitInfo: {
        initialKey,
        initialGuardianHash,
        initialGuardianSafePeriod
      }
    }

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(params))}`
    const link = document.createElement("a")
    link.setAttribute("href", dataStr)
    link.setAttribute("target", "_blank")
    link.setAttribute("download", filename)
    link.click()

    setDownloading(false)
    setDownloaded(true)
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>Backup Guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody fontSize="0.875em" textAlign="center" maxWidth="500px">
          Make sure to save your list of guardians for social recovery. Choose at least one method below to keep this list safe.
        </TextBody>
      </Box>
      <Box display="flex">
        <Box width="400px" borderRight="1px solid #D7D7D7" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading3>Set Guardians</Heading3>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              If you choose to store your own guardian list, make you save the file and remember it's location as it will be needed for future wallet recovery.
            </TextBody>
          </Box>
          <FormInput
            label=""
            placeholder="Send to Email"
            value={emailForm.values.email}
            errorMsg={emailForm.showErrors.email && emailForm.errors.email}
            onChange={emailForm.onChange('email')}
            onBlur={emailForm.onBlur('email')}
            _styles={{ width: '100%', marginTop: '0.75em' }}
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
          <Button onClick={handleDownloadGuardians} disabled={downloading} loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }} LeftIcon={<DownloadIcon />}>
            Download
          </Button>
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
      <Button disabled={!(loaded && downloaded && sended)} onClick={handleNext} _styles={{ width: '400px', marginTop: '0.75em' }}>
        Continue
      </Button>
    </Box>
  )
};

export default SaveGuardians;
