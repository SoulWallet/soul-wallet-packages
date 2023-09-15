import {
  RecoverStepEn,
  StepContextProvider,
  useStepContext,
  StepActionTypeEn,
  useStepDispatchContext,
} from "@src/context/StepContext";
import React, { useEffect, useMemo, useState } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { RecoveryContextProvider } from "@src/context/RecoveryContext";
import {EnHandleMode} from '@src/lib/type'
import EnterWalletAddress from "@src/pages/v1/Recover/EnterWalletAddress";
import SetWalletPassword from "@src/pages/v1/Recover/SetWalletPassword";
import SignatureRequest from "@src/pages/v1/Recover/SignatureRequest";
import UploadGuardians from "@src/pages/v1/Recover/UploadGuardians";
import { useGuardianStore } from "@src/store/guardian";
import useBrowser from "@src/hooks/useBrowser";

type StepNodeInfo = {
  title: string;
  element: JSX.Element;
};

const StepComponent = () => {
  const dispatch = useStepDispatchContext();

  const [walletAddress, setWalletAddress] = useState("");
  const [payToken, setPayToken] = useState("");
  const [recoverStatus, setRecoverStatus] = useState("n/m");
  const { recoverRecordId, newKey } = useGuardianStore();
  const { navigate } = useBrowser()

  const onStepChange = (i: any) => {
    if (i === -1) {
      navigate('launch?mode=web')
    } else {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: i,
      });
    }
  }

  const onRecoverSubmit = async (wAddress: string, pToken: string) => {
    setWalletAddress(wAddress);
    await setLocalStorage("walletAddress", wAddress);
    setPayToken(pToken);
  };

  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [RecoverStepEn.Start]: {
        title: "Recover your wallet",
        element: <EnterWalletAddress onStepChange={onStepChange} onSubmit={onRecoverSubmit} />,
      },
      [RecoverStepEn.UploadGuardians]: {
        title: "Enter Guardian Address",
        element: <UploadGuardians onStepChange={onStepChange} />,
      },
      [RecoverStepEn.ResetPassword]: {
        title: "Set New Password",
        element: <SetWalletPassword onStepChange={onStepChange} />,
      },
      [RecoverStepEn.GuardiansChecking]: {
        title: "Enter Guardian Address",
        element: <SignatureRequest />,
      },
    };
  }, [walletAddress, payToken, recoverStatus]);

  const {
    step: { current },
  } = useStepContext();

  useEffect(() => {
    if (recoverRecordId && newKey) {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.GuardiansChecking,
      });
    }
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
