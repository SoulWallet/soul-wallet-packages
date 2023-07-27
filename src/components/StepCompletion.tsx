import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
import React from "react";
import {EnHandleMode} from '@src/lib/type'
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"

interface IStepCompletion {
  mode: EnHandleMode;
}

const StepCompletion = ({ mode }: IStepCompletion) => {
  const { goPlugin } = useBrowser();

  if (mode === EnHandleMode.Create) {
    return (
      <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Text fontSize="1.25em" fontWeight="bold">
          Congratulation!
        </Text>
        <Box marginBottom="0.75em">
          <Text fontSize="0.875em" textAlign="center" maxWidth="500px">
            You're now ready to navigate Ethereum with security and simplicity thanks to your new Soul Wallet.
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <p className="mt-2 mb-3 mx-0">
        Now you can use your wallet address to receive any cryptos, <br />
        and unlock full services by activiting your wallet.
      </p>

      <p className="text-warnRed mt-16">Warning: This is an alpha version. DO NOT put too much money in.</p>

      {(mode as EnHandleMode) === EnHandleMode.Create && (
        <>
          <Button type="primary" onClick={() => goPlugin("/activate-wallet")} className="mt-2 w-full">
            Activate Wallet
          </Button>
          <Button type="link" onClick={() => goPlugin("")} className="mt-2 w-full">
            Activate Later
          </Button>
        </>
      )}

      {mode === EnHandleMode.Recover && (
        <>
          <Button type="primary" onClick={() => goPlugin("")} className="mt-2 w-full">
            See my wallet
          </Button>
        </>
      )}
    </Box>
  );
};

export default StepCompletion;
