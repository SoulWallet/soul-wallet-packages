import React, { useState, useRef } from 'react';
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import { Box, Text, Image } from "@chakra-ui/react"

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeystore();
  const { generateWalletAddress } = useWallet();
  const { updateFinalGuardians } = useGlobalStore();
  const formRef = useRef<IGuardianFormHandler>(null);
  const [showTips, setShowTips] = useState(false)

  const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const handleNext = async () => {
    try {
      const guardianList = (await formRef.current?.submit()) as GuardianItem[];
      if (guardianList?.length === 0) {
        return;
      }
      updateFinalGuardians(guardianList);

      const eoaAddress = await keystore.getAddress();

      const guardianAddress = guardianList.map((item) => item.address);

      generateWalletAddress(eoaAddress, guardianAddress, true);

      handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    updateFinalGuardians([]);
    const eoaAddress = await keystore.getAddress();
    generateWalletAddress(eoaAddress, [], true);
    handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault);
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Text fontSize="1.25em" fontWeight="bold">
        Discard change
      </Text>
      <Box marginBottom="0.75em">
        <Text fontSize="0.875em" textAlign="center">
          New guardians updating in 12:56:73.<Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show more</Text>
        </Text>
      </Box>
      {showTips && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em">
          <Box>
            <Text fontSize="0.875em">
              You have a pending update, and it can be canceled before the time above runs out. To cancel this pending update, click "Discard Changes" below.
            </Text>
          </Box>
        </Box>
      )}
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
        <Button
          disabled={false}
          onClick={handleNext}
          _styles={{ width: '455px' }}
        >
          Discard Change
        </Button>
        <TextButton
          color="rgb(137, 137, 137)"
          onClick={handleSkip}
          _styles={{ width: '455px' }}
        >
          Backup current guardians
        </TextButton>
      </Box>
    </Box>
  )

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Text fontSize="1.25em" fontWeight="bold">
        Edit Guardians
      </Text>
      <Box marginBottom="0.75em">
        <Text fontSize="0.875em" textAlign="center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show more</Text>
        </Text>
      </Box>
      {showTips && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em">
          <Box>
            <Text fontSize="1em" lineHeight="1.25em" fontWeight="bold" marginBottom="0.75em">
              What is a guardian?
            </Text>
            <Text>
              Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces seed phrases with guardian-signature social recovery, improving security and usability.
            </Text>
            <Text fontSize="1em" lineHeight="1.25em" fontWeight="bold" marginBottom="0.75em">
              What wallet can be set as guardian?
            </Text>
            <Text>
              You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as one of your guardians, ensure it's currently setup on Ethereum for social recovery.
            </Text>
            <Text fontSize="1em" lineHeight="1.25em" fontWeight="bold" marginBottom="0.75em">
              What is wallet recovery?
            </Text>
            <Text>
              If your Soul Wallet is lost or stolen, social recovery help you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
            </Text>
            <Text>
              After successfully recovering your wallet, your guardians' addresses will be visible on-chain. To maintain privacy, consider changing your guardian list after you complete a recovery.
            </Text>
          </Box>
        </Box>
      )}
      <GuardianForm ref={formRef} />
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
        <Button
          disabled={false}
          onClick={handleNext}
          _styles={{ width: '455px' }}
        >
          Continue
        </Button>
        <TextButton
          color="rgb(137, 137, 137)"
          onClick={handleSkip}
          _styles={{ width: '455px' }}
        >
          Backup current guardians
        </TextButton>
      </Box>
    </Box>
  );
}
