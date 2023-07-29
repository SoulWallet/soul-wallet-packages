import { SButton } from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useState } from "react";
import GuardiansSaver from "@src/components/GuardiansSaver";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import WarningIcon from "@src/components/Icons/Warning";

const GuardiansSaving = () => {
  const [hasSaved, setHasSaved] = useState(false);
  const [skipped] = useState(false);

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

  if (skipped) {
    return (
      <Box maxWidth="400px">
        <Box background="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="20px" paddingBottom="0" borderRadius="16px">
          <Box marginBottom="1em"><WarningIcon /></Box>
          <Heading3 width="100%">What if I don’t set up guardian now?</Heading3>
          <TextBody width="100%" marginBottom="1em">Guardians are required to recover your wallet in the case of loss or theft. You can learn more here</TextBody>
          <Heading3 width="100%">Can I set guardians in the future?</Heading3>
          <TextBody width="100%" marginBottom="1em">Yes. You can setup or change your guardians anytime on your home page.</TextBody>
          <Button width="100%">Set guardians now</Button>
          <TextButton width="100%">I understand the risks, skip for now</TextButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

      <Heading1>Backup Guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody fontSize="0.875em" textAlign="center" maxWidth="500px">
          Make sure to save your list of guardians for social recovery. Choose at least one method below to keep this list safe.
        </TextBody>
      </Box>
      <GuardiansSaver onSave={handleSaved} />
      <Button disabled={false} onClick={handleNext} _styles={{ width: '400px', marginTop: '0.75em' }}>
        Continue
      </Button>
    </Box>
  )
};

export default GuardiansSaving;
