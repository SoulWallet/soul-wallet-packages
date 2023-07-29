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

interface IGuardianChecking {
  walletAddress: string;
  payToken: string;
}

const GuardiansChecking = ({ walletAddress, payToken }: IGuardianChecking) => {
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

  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Text fontSize="1.25em" fontWeight="bold">
        Guardian signature request
      </Text>
      <Box marginBottom="0.75em">
        <Text fontSize="0.875em" textAlign="center">
          Share this link with your guardians to sign.
        </Text>
      </Box>
      <Box
        marginBottom="0.75em"
        background="white"
        borderRadius="1em"
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="0.875em" fontWeight="bold" marginBottom="0.75em" cursor="pointer">Copy to Clickboard</Text>
        <Box width="150px" height="150px" background="grey" />
      </Box>
      <Box marginBottom="0.75em">
        <Text fontSize="0.875em" textAlign="center" fontWeight="bold">
          Waiting for signatures (2 of 3 complete)
        </Text>
      </Box>
      <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="0.875em" fontWeight="bold" fontFamily={"Martian"}>0xFDF7...7890</Box>
          <Box fontSize="0.875em" fontWeight="bold" color="#1CD20F">Signed</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="0.875em" fontWeight="bold" fontFamily={"Martian"}>0xFDF7...7890</Box>
          <Box fontSize="0.875em" fontWeight="bold" color="#848488">Waiting</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="0.875em" fontWeight="bold" fontFamily={"Martian"}>0xFDF7...7890</Box>
          <Box fontSize="0.875em" fontWeight="bold" color="#E83D26">Error</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="0.875em" fontWeight="bold" fontFamily={"Martian"}>0xFDF7...7890</Box>
          <Box fontSize="0.875em" fontWeight="bold" color="#1CD20F">Signed</Box>
        </Box>
        <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
          <Box fontSize="0.875em" fontWeight="bold" fontFamily={"Martian"}>0xFDF7...7890</Box>
          <Box fontSize="0.875em" fontWeight="bold" color="#848488">Waiting</Box>
        </Box>
      </Box>
      <Button
        disabled={false}
        onClick={() => {}}
        _styles={{ width: '100%' }}
      >
        Next
      </Button>
    </Box>
  )
};

export default GuardiansChecking;
