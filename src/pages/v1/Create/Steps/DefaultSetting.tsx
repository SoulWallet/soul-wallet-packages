import { SButton } from "@src/components/Button";
import browser from "webextension-polyfill";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCardIcon from "@src/components/Icons/WalletCard";
import React from "react";
import WalletCard from "@src/components/web/WalletCard";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";


const DefaultSetting = () => {
  const dispatch = useStepDispatchContext();

  const handleNext = async (setDefault = true) => {
    await browser.storage.local.set({ shouldInject: setDefault });

    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: CreateStepEn.Completed,
    });
  };

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <WalletCard statusText="SET AS DEFAULT" />
      <Heading1>Set as defaul wallet</Heading1>
      <Box marginBottom="2em">
        <TextBody textAlign="center" maxWidth="400px">
          Boost your Ethereum journey by setting Soul Wallet as your primary plugin wallet. You can always easily change this setting.
        </TextBody>
      </Box>
      <Button onClick={() => handleNext(true)} _styles={{ width: '100%', marginTop: '0.75em' }}>
        Yes
      </Button>
      <TextButton onClick={() => handleNext(false)} _styles={{ width: '100%' }}>
        Skip
      </TextButton>
    </Box>
  );
};

export default DefaultSetting;
