import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import ModalV2 from "@src/components/ModalV2";
import useWallet from "@src/hooks/useWallet";
import { useRecoveryContext } from "@src/context/RecoveryContext";
import { GuardianItem } from "@src/lib/type";
import { notify } from "@src/lib/tools";
import { Box, Text, Image } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import CopyIcon from "@src/components/Icons/Copy";
import CheckedIcon from "@src/components/Icons/Checked";
import ErrorIcon from "@src/components/Icons/Error";

interface IGuardianChecking {
  walletAddress: string;
  payToken: string;
}

const RecoverInProgress = ({ walletAddress, payToken }: IGuardianChecking) => {
  const [loading, setLoading] = useState(false);
  const { initRecoverWallet } = useWallet();

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

  const handleAskSignature = async () => {
    handleCheckGuardianAddresses();
    try {
      setLoading(true)
      const guardians = (await formRef.current?.submit()) as GuardianItem[];
      await initRecoverWallet(walletAddress, guardians, payToken);
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

  const handleNext = async () => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.SignaturePending,
    });
  }

  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>Recovery in progress</Heading1>
      <Box marginTop="2em" marginBottom="2em">
        <TextBody textAlign="center">
          Ethereum wallets you have recovered
        </TextBody>
      </Box>
      <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
            Recovered
            <Text marginLeft="4px"><CheckedIcon /></Text>
          </Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
            Recovered
            <Text marginLeft="4px"><CheckedIcon /></Text>
          </Box>
        </Box>
      </Box>
      <Box marginTop="2em" marginBottom="2em">
        <TextBody textAlign="center">
          Estimated time until your Layer2 wallets are recovered: 12:56:73
        </TextBody>
      </Box>
      <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#848488">Pending</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#848488">Pending</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#848488">Pending</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
          <Box fontSize="14px" fontWeight="bold" color="#848488">Pending</Box>
        </Box>
      </Box>
    </Box>
  )
};

export default RecoverInProgress;
