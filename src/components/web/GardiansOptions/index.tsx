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
import TextBody from "@src/components/web/TextBody";

interface IProps {
  onSave: () => void;
  handleNext?: () => void;
}

const GuardiansSaver = ({ onSave, handleNext }: IProps) => {
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

    onSave();
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
        onSave();
      }
    } catch {
      // maybe toast error message?
    } finally {
      setSending(false);
    }
  };

  return (
    <Box display="flex">
      <Box width="400px" borderRight="1px solid #D7D7D7" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
        <Heading2>Option 1</Heading2>
        <Box marginBottom="0.75em">
          <TextBody fontSize="0.875em" textAlign="center">
            Due to your choice of private on-chain guardians, information must be manually entered to continue recovery.
          </TextBody>
        </Box>
        <Button onClick={handleDownload} loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }}>
          Upload file
        </Button>
      </Box>
      <Box width="400px" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
        <Heading2 marginBottom="0.75em">
          Option 2
        </Heading2>
        <Box marginBottom="0.75em">
          <TextBody fontSize="0.875em" textAlign="center">
            Enter the Ethereum wallets addresses you sat up as  guardians.
          </TextBody>
        </Box>
        <GuardianForm noNameInput={true} />
        <Button loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }} onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default GuardiansSaver;
