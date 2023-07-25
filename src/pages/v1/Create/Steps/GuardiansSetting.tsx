import React, { useState, useRef } from 'react';
import { SButton } from "@src/components/Button";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { useGlobalStore } from "@src/store/global";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";

export default function GuardiansSetting() {
  const dispatch = useStepDispatchContext();
  const keystore = useKeystore();
  const { generateWalletAddress } = useWallet();
  const { updateFinalGuardians } = useGlobalStore();
  const formRef = useRef<IGuardianFormHandler>(null);
  const [showTips, setShowTips] = useState(false)

  const handleJumpToTargetStep = (targetStep: CreateStepEn) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
  };

  const handleNext = async () => {
    try {
      const guardianList = (await formRef.current?.submit()) as GuardianItem[];
      if (guardianList?.length === 0) {
        return;
      }
      updateFinalGuardians(guardianList);

      const eoaAddress = await keystore.getAddress();

      const guardianAddress = guardianList.map((item) => item.address);

      generateWalletAddress(eoaAddress, guardianAddress, true);

      handleJumpToTargetStep(CreateStepEn.SaveGuardianList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    updateFinalGuardians([]);
    const eoaAddress = await keystore.getAddress();
    generateWalletAddress(eoaAddress, [], true);
    handleJumpToTargetStep(CreateStepEn.SetSoulWalletAsDefault);
  };

  const toggleTips = (event: any) => {
    console.log('toggleTips', event)
    setShowTips(!showTips)
  }

  return (
    <div className="max-w-lg">
      <div className="page-title text-center">
        Set Guardians
      </div>
      <div className="tip-preview">
        <p className="tip-text mt-6 mb-6 whitespace-pre-wrap text-center">
          Choose trusted friends or use your existing Ethereum wallets as guardians. We recommend setting up at least three for optimal protection. <a onClick={toggleTips} className="btn-more">Show more</a>
        </p>
      </div>
      {showTips && (
        <div className="tip-container">
          <div>
            <div className="tip-title mt-6 mb-4 whitespace-pre-wrap">
              What is a guardian?
            </div>
            <p className="tip-text mt-4 mb-4 whitespace-pre-wrap">
              Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces seed phrases with guardian-signature social recovery, improving security and usability.
            </p>
            <div className="tip-title mt-4 mb-4 whitespace-pre-wrap">
              What wallet can be set as guardian?
            </div>
            <p className="tip-text mt-4 mb-4 whitespace-pre-wrap">
              You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as one of your guardians, ensure it's currently setup on Ethereum for social recovery.
            </p>
            <div className="tip-title mt-4 mb-4 whitespace-pre-wrap">
              What is wallet recovery?
            </div>
            <p className="tip-text mt-4 mb-4 whitespace-pre-wrap">
              If your Soul Wallet is lost or stolen, social recovery help you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
            </p>
            <p className="tip-text mt-4 mb-6 whitespace-pre-wrap">
              After successfully recovering your wallet, your guardians' addresses will be visible on-chain. To maintain privacy, consider changing your guardian list after you complete a recovery.
            </p>
          </div>
        </div>
      )}

      <GuardianForm ref={formRef} />

      <div className="flex flex-col items-center gap-4">
        <SButton className="mt-6 w-base" type={"primary"} disabled={false} onClick={handleNext}>
          Continue
        </SButton>

        <a className="skip-text mb-8" onClick={handleSkip}>
          Skip for now
        </a>
      </div>
    </div>
  );
}
