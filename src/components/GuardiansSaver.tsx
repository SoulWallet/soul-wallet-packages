import React, { useEffect, useState } from "react";
import { SButton } from "./Button";
import InputWrapper from "./InputWrapper";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";
import { Box, Text, Image } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import DownloadIcon from '@src/components/Icons/Download'
import SendIcon from '@src/components/Icons/Send'

interface IProps {
  onSave: () => void;
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
        <Heading3>Set Guardians</Heading3>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center">
            If you choose to store your own guardian list, make you save the file and remember it's location as it will be needed for future wallet recovery.
          </TextBody>
        </Box>
        <FormInput
          label=""
          placeholder="Send to Email"
          value={email}
          errorMsg={email && !isEmailValid ? "Please enter a valid email address." : undefined}
          onChange={handleEmailChange}
          _styles={{ width: '100%', marginTop: '0.75em' }}
          RightIcon={<SendIcon />}
        // onClick={handleSendEmail}
        />
        <Button onClick={handleDownload} loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }} LeftIcon={<DownloadIcon />}>
          Download
        </Button>
      </Box>
      <Box width="400px" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
        <Heading3>Save with Soul Wallet</Heading3>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center">
            Soul Wallet can store your list encrypted on-chain, but you still need to remember your wallet address for recovery.
          </TextBody>
        </Box>
        <Button loading={downloading} _styles={{ width: '100%' }}>
          Store On-chain
        </Button>
      </Box>
    </Box>
  );
};

export default GuardiansSaver;
