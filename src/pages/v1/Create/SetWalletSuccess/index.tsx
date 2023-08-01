import useBrowser from "@src/hooks/useBrowser";
import React from "react";
import {EnHandleMode} from '@src/lib/type'
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

interface IStepCompletion {
  mode: EnHandleMode;
}

const SetWalletSuccess = ({ mode }: IStepCompletion) => {
  const { goPlugin } = useBrowser();

  if (mode === EnHandleMode.Create) {
    return (
      <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Heading1>Congratulation!</Heading1>
        <Box marginBottom="0.75em">
          <TextBody maxWidth="400px" textAlign="center">
            You're now ready to navigate Ethereum with security and simplicity thanks to your new Soul Wallet.
          </TextBody>
        </Box>
      </Box>
    )
  }

  return null
};

export default SetWalletSuccess;
