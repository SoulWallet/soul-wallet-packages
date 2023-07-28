import React, { useEffect, useState } from "react";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";
import { Box, Text, Image } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import FormInput from "@src/components/web/Form/FormInput";
import GuardianForm from "@src/components/GuardianForm";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

interface IProps {
  onSave?: () => void;
}

const GuardiansSaver = ({ onSave }: IProps) => {
  const { downloadJsonFile, emailJsonFile, formatGuardianFile } = useTools();
  const { guardians } = useGlobalStore();
  const [email, setEmail] = useState<string>();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const handleDownload = async () => {
    setDownloading(true);

    const walletAddress = await getLocalStorage("walletAddress");

    const jsonToSave = formatGuardianFile(walletAddress, guardians);

    downloadJsonFile(jsonToSave);

    setDownloading(false);

    if (onSave) onSave();
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
  };

  const handleSendEmail = async () => {
    if (!email) {
      return;
    }
    setSending(true);

    try {
      const walletAddress = await getLocalStorage("walletAddress");

      const jsonToSave = formatGuardianFile(walletAddress, guardians);

      const res: any = await emailJsonFile(jsonToSave, email);

      if (res.code === 200) {
        if (onSave) onSave();
      }
    } catch {
      // maybe toast error message?
    } finally {
      setSending(false);
    }
  };

  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>Set Guardians</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          In order to finalize the setting of your guardians, a gas fee must be paid on Ethereum. Choose one method below to continue.
        </TextBody>
      </Box>
      <Box display="flex">
        <Box width="400px" borderRight="1px solid #D7D7D7" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading2>Option 1</Heading2>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              Connect and pay with any Ethereum wallet using the link below.
            </TextBody>
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
            <Box width="150px" height="150px" background="grey" />
            <Text fontSize="0.875em" fontWeight="bold" marginTop="0.75em" cursor="pointer">Truncated Url</Text>
          </Box>
        </Box>
        <Box width="400px" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading2 marginBottom="0.75em">
            Option 2
          </Heading2>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              Pay with your activated Soul Wallet on Ethereum
            </TextBody>
          </Box>
          <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
            <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
              <Box fontSize="0.875em" fontWeight="bold">0xFDF7...7890</Box>
              <Box fontSize="0.875em" fontWeight="bold" color="#1CD20F"></Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" marginTop="0.75em">
            <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" fontSize="0.875em" fontWeight="bold" paddingTop="4px">
              <Box>Network:</Box>
              <Box>Ethereum</Box>
            </Box>
            <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" fontSize="0.875em" fontWeight="bold" paddingTop="4px">
              <Box>Network fee:</Box>
              <Box>2.22 ETH</Box>
            </Box>
          </Box>
          <Button loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }}>
            Set up
          </Button>
          <TextButton
            color="rgb(137, 137, 137)"
            onClick={() => {}}
            _styles={{ width: '100%' }}
          >
            Cancel
          </TextButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GuardiansSaver;
