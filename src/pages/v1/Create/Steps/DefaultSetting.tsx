import Button from "@src/components/Button";
import browser from "webextension-polyfill";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import WalletCardIcon from "@src/components/Icons/WalletCard";
import React from "react";

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
    <div className="max-w-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="wallet-card">
          <div className="wallet-card-icon">
            <WalletCardIcon />
          </div>
          <div className="wallet-card-content">
            <div className="wallet-card-text">
              <div className="wallet-card-status">SET AS DEFAULT</div>
            </div>
            <div className="wallet-card-text">NEW SOUL WALLET...</div>
          </div>
        </div>
        <div className="page-title text-center">Set as defaul wallet</div>
        <p className="tip-text mt-4 mb-8 text-center">Boost your Ethereum journey by setting Soul Wallet as your primary plugin wallet. You can always easily change this setting.</p>

        <Button className="w-full" type="primary" onClick={() => handleNext(true)}>
          Yes
        </Button>

        <a className="skip-text mx-auto self-center my-5" onClick={() => handleNext(false)}>
          Skip
        </a>
      </div>
    </div>
  );
};

export default DefaultSetting;
