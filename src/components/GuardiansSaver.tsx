import React, { useEffect, useState } from "react";
import { SButton } from "./Button";
import InputWrapper from "./InputWrapper";
import { getLocalStorage, validateEmail } from "@src/lib/tools";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";

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
    <div className="flex flex-row">
      <div className="save-gardian-section save-gardian-section-byself">
        <div className="save-gardian-title">Save by yourself</div>
        <div className="save-gardian-text">If you choose to store your own guardian list, make you save the file and remember it's location as it will be needed for future wallet recovery.</div>
        <InputWrapper
          className="mb-4"
          label=""
          placeholder="Send to Email"
          value={email}
          errorMsg={email && !isEmailValid ? "Please enter a valid email address." : undefined}
          onChange={handleEmailChange}
          onClick={handleSendEmail}
        />
        <SButton type="default" onClick={handleDownload} className="w-full" loading={downloading}>
          Download
        </SButton>
      </div>
      <div className="save-gardian-section">
        <div className="save-gardian-title">Save with Soul Wallet</div>
        <div className="save-gardian-text">Soul Wallet can store your list encrypted on-chain, but you still need to remember your wallet address for recovery.</div>
        <SButton type="default" onClick={handleDownload} className="w-full" loading={downloading}>
          Store On-chain
        </SButton>
      </div>
    </div>
  );
};

export default GuardiansSaver;
