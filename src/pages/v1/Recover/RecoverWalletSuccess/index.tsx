import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState, useEffect } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import ModalV2 from "@src/components/ModalV2";
import useWallet from "@src/hooks/useWallet";
import { useRecoveryContext } from "@src/context/RecoveryContext";
import { GuardianItem } from "@src/lib/type";
import { notify } from "@src/lib/tools";
import { Box, Text, Image, useToast } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import CopyIcon from "@src/components/Icons/Copy";
import CheckedIcon from "@src/components/Icons/Checked";
import ErrorIcon from "@src/components/Icons/Error";
import useTools from "@src/hooks/useTools";
import { useGuardianStore } from "@src/store/guardian";
import { copyText } from "@src/lib/tools";
import useWalletContext from "@src/context/hooks/useWalletContext";
import api from "@src/lib/api";

const toShortAddress = (address: string) => {
  if (address.length > 10) {
    return `${address.slice(0, 5)}...${address.slice(-5)}`
  }

  return address
}

const RecoverWalletSuccess = () => {
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { generateQrCode } = useTools();
  const { guardians, threshold, slot, slotInitInfo, recoverRecordId, guardianSignatures, setGuardianSignatures } = useGuardianStore();
  // const { initRecoverWallet } = useWallet();
  const toast = useToast()
  const { account, replaceAddress, getAccount } = useWalletContext()

  const formRef = useRef<IGuardianFormHandler>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  const { cachedGuardians } = useRecoveryContext();
  const dispatch = useStepDispatchContext();
  const handleCheckGuardianAddresses = () => {
    // TODO: here
    // // 👇 mock logic, delete it
    // setShowVerificationModal(true);
    // setTimeout(() => {
    //     setShowVerificationModal(false);
    // }, 3000);
    // ! if check pass, then submit guardians to the global store
    // formRef.current?.submit();
    // TODO: once the guardians are submitted, clear the temporary guardians
  };

  const doCopy = () => {
    copyText(recoverRecordId)
    toast({
      title: "Copy success!",
      status: "success",
    });
  };

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR(recoverRecordId)
  }, []);

  const getRecoverRecord = async () => {
    const result = await api.guardian.getRecoverRecord({ recoveryRecordID: recoverRecordId })
    console.log('guardianSignatures', result)
    const guardianSignatures = result.data.guardianSignatures
    setGuardianSignatures(guardianSignatures)
    console.log('recoveryRecordID', result, guardianSignatures)
  }

  useEffect(() => {
    getRecoverRecord()

    setInterval(async () => {
      getRecoverRecord()
    }, 5000)
  }, []);

  const handleAskSignature = async () => {
    handleCheckGuardianAddresses();
    try {
      setLoading(true)
      const guardians = (await formRef.current?.submit()) as GuardianItem[];
      // await initRecoverWallet(walletAddress, guardians, payToken);
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.SignaturePending,
      });
    } catch (error) {
      notify("Error", "Failed to init recover request")
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  const replaceWallet = async () => {
    console.log('replaceWallet', account)
    // replaceAddress()
    // getAccount()
  }

  // console.log('account111', account)
  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Heading1 _styles={{ marginBottom: '20px' }}>Recover wallet success</Heading1>
      <Button
        disabled={false}
        onClick={replaceWallet}
        _styles={{ width: '100%' }}
      >
        Replace Wallet
      </Button>
    </Box>
  )
};

export default RecoverWalletSuccess;
