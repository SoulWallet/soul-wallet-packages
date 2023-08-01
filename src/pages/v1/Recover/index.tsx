import {
  RecoverStepEn,
  StepContextProvider,
  useStepContext,
  StepActionTypeEn,
  useStepDispatchContext,
} from "@src/context/StepContext";
import React, { useEffect, useMemo, useState } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ProgressNavBar from "@src/components/ProgressNavBar";
import RecoverStarter from "./Steps/RecoverStarter";
import SignaturePending from "./Steps/SignaturePending";
import GuardiansChecking from "./Steps/GuardiansChecking";
import GuardiansImporting from "./Steps/GuardiansImporting";
import RecoverInProgress from "./Steps/RecoverInProgress";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { RecoveryContextProvider } from "@src/context/RecoveryContext";
import StepCompletion from "@src/components/StepCompletion";
import {EnHandleMode} from '@src/lib/type'
import EnterWalletAddress from "@src/pages/v1/Recover/EnterWalletAddress";
import SetWalletPassword from "@src/pages/v1/Recover/SetWalletPassword";
import EnterGuardiansAddress from "@src/pages/v1/Recover/EnterGuardiansAddress";

type StepNodeInfo = {
  title: string;
  element: JSX.Element;
};

const StepComponent = () => {
  const dispatch = useStepDispatchContext();

  const [walletAddress, setWalletAddress] = useState("");
  const [payToken, setPayToken] = useState("");
  const [recoverStatus, setRecoverStatus] = useState("n/m");

  const onRecoverSubmit = async (wAddress: string, pToken: string) => {
    setWalletAddress(wAddress);
    await setLocalStorage("walletAddress", wAddress);
    setPayToken(pToken);
  };

  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [RecoverStepEn.Start]: {
        title: "Recover your wallet",
        element: <EnterWalletAddress onSubmit={onRecoverSubmit} />,
      },
      [RecoverStepEn.ResetPassword]: {
        title: "Set New Password",
        element: <SetWalletPassword />,
      },
      [RecoverStepEn.GuardiansImporting]: {
        title: "Import Guardian Address File",
        element: <EnterGuardiansAddress />,
      },
      [RecoverStepEn.GuardiansChecking]: {
        title: "Enter Guardian Address",
        element: <GuardiansChecking walletAddress={walletAddress} payToken={payToken} />,
      },
      [RecoverStepEn.SignaturePending]: {
        title: `Waiting Signature (${recoverStatus}) `,
        element: <SignaturePending onChange={setRecoverStatus} />,
      },
      [RecoverStepEn.RecoverInProgress]: {
        title: `Waiting Signature (${recoverStatus}) `,
        element: <RecoverInProgress walletAddress="" payToken="" />,
      },
      [RecoverStepEn.Completed]: {
        title: "Congratulation! Your Soul Wallet is recovered.",
        element: <StepCompletion mode={EnHandleMode.Recover} />,
      },
    };
  }, [walletAddress, payToken, recoverStatus]);

  const {
    step: { current },
  } = useStepContext();

  const checkRecoverStatus = async () => {
    const opHash = await getLocalStorage("recoverOpHash");
    if (opHash) {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.SignaturePending,
      });
    }
  };

  useEffect(() => {
    checkRecoverStatus();
  }, []);

  return (
    <div>{stepNodeMap[current].element}</div>
  );
};

export default function RecoverPage() {
  return (
    <FullscreenContainer>
      <RecoveryContextProvider>
        <StepContextProvider>
          <StepComponent />
        </StepContextProvider>
      </RecoveryContextProvider>
    </FullscreenContainer>
  );
}
