import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
import React from "react";
import {EnHandleMode} from '@src/lib/type'


interface IStepCompletion {
  mode: EnHandleMode;
}

const StepCompletion = ({ mode }: IStepCompletion) => {
  const { goPlugin } = useBrowser();

  if (mode === EnHandleMode.Create) {
    return (
      <div className="max-w-lg">
        <div className="tip-text mx-0 pb-6">
          <div className="page-title text-center">Congratulation!</div>
          <p className="mt-2 mb-3 mx-0 text-center">
            You're now ready to navigate Ethereum with security and simplicity thanks to your new Soul Wallet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="tip-text mx-0 pb-6">
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
    </div>
  );
};

export default StepCompletion;
