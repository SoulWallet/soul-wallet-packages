import React, { Fragment, useState } from "react"
import { Box, Text } from "@chakra-ui/react"
import Heading3 from "@src/components/web/Heading3"
import TextBody from "@src/components/web/TextBody"

export default function GuardiansTips() {
  const [showTips, setShowTips] = useState(false)

  const toggleTips = (event: any) => {
    setShowTips(!showTips)
  }

  return (
    <Fragment>
      <Box marginBottom="12px">
        <TextBody textAlign="center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. <Text onClick={toggleTips} color="#EC588D" cursor="pointer">Show {showTips ? 'less' : 'more'}</Text>
        </TextBody>
      </Box>
      {showTips && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" marginBottom="1.5em" marginTop="1.5em" maxWidth="500px">
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
    </Fragment>
  )
}
