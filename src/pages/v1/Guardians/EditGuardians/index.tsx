import React, { useState, useRef } from 'react';
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, GuardiansStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useKeyring from "@src/hooks/useKeyring";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const { generateWalletAddress } = useWallet();
  const { updateFinalGuardians } = useGlobalStore();
  const formRef = useRef<IGuardianFormHandler>(null);
  const [showTips, setShowTips] = useState(false)

  const handleJumpToTargetStep = (targetStep: GuardiansStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const handleNext = async () => {
    handleJumpToTargetStep(GuardiansStepEn.Set);
    /* try {
     *   const guardianList = (await formRef.current?.submit()) as GuardianItem[];
     *   if (guardianList?.length === 0) {
     *     return;
     *   }
     *   updateFinalGuardians(guardianList);

     *   const eoaAddress = await keystore.getAddress();

     *   const guardianAddress = guardianList.map((item) => item.address);

     *   generateWalletAddress(eoaAddress, guardianAddress, true);

     *   handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
     * } catch (err) {
     *   console.error(err);
     * } */
  };

  const handleSkip = async () => {
    /* updateFinalGuardians([]);
     * const eoaAddress = await keystore.getAddress();
     * generateWalletAddress(eoaAddress, [], true);
     * handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault); */
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  /* return (
   *   <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
   *     <Heading1>
   *       Discard change
   *     </Heading1>
   *     <Box marginBottom="0.75em">
   *       <TextBody textAlign="center">
   *         New guardians updating in 12:56:73.<Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show more</Text>
   *       </TextBody>
   *     </Box>
   *     {showTips && (
   *       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em">
   *         <Box>
   *           <TextBody>
   *             You have a pending update, and it can be canceled before the time above runs out. To cancel this pending update, click "Discard Changes" below.
   *           </TextBody>
   *         </Box>
   *       </Box>
   *     )}
   *     <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
   *       <Button
   *         disabled={false}
   *         onClick={handleNext}
   *         _styles={{ width: '455px' }}
   *       >
   *         Discard Change
   *       </Button>
   *       <TextButton
   *         color="rgb(137, 137, 137)"
   *         onClick={handleSkip}
   *         _styles={{ width: '455px' }}
   *       >
   *         Backup current guardians
   *       </TextButton>
   *     </Box>
   *   </Box>
   * ) */

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>
        Edit Guardians
      </Heading1>
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
          onClick={() => {}}
          _styles={{ width: '455px' }}
        >
          Backup current guardians
        </TextButton>
      </Box>
    </Box>
  );
}
