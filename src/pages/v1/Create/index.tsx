import { CreateStepEn, StepContextProvider, useStepContext, useStepDispatchContext, StepActionTypeEn } from "@src/context/StepContext";
import React, { ReactNode, useMemo, useState, useRef } from "react";
import {EnHandleMode} from '@src/lib/type'
import FullscreenContainer from "@src/components/FullscreenContainer";
import SetPassword from "@src/pages/v1/Create/SetPassword";
import SetGuardians from "@src/pages/v1/Create/SetGuardians";
import SaveGuardians from "@src/pages/v1/Create/SaveGuardians";
import SetDefaultWallet from "@src/pages/v1/Create/SetDefaultWallet";
import SetWalletSuccess from "@src/pages/v1/Create/SetWalletSuccess";

type StepNodeInfo = {
  title: string;
  element: ReactNode;
  hint?: ReactNode;
};

const StepComponent = () => {
  const dispatch = useStepDispatchContext();
  const passwordRef = useRef('')

  const onStepChange = (i: any) => {
    console.log('onStepChange', i)
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: i,
    });
  }

  const setPassword = (password: any) => {
    passwordRef.current = password
  }

  const getPassword = () => {
    return passwordRef.current
  }
  console.log('password 222', passwordRef)

  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [CreateStepEn.CreatePWD]: {
        title: "Get Started",
        element: <SetPassword onStepChange={onStepChange} setPassword={setPassword} />,
      },
      [CreateStepEn.SetGuardians]: {
        title: "Set up Guardians",
        element: <SetGuardians onStepChange={onStepChange} />
      },
      [CreateStepEn.SaveGuardian]: {
        title: "Save Guardian List",
        element: <SaveGuardians onStepChange={onStepChange} getPassword={getPassword} />,
      },
      [CreateStepEn.SetSoulWalletAsDefault]: {
        title: "Set as default plugin wallet",
        element: <SetDefaultWallet />,
      },
      [CreateStepEn.Completed]: {
        title: "Congratulation, your Soul Wallet is created!",
        element: (<SetWalletSuccess mode={EnHandleMode.Create} />) as any,
      },
    };
  }, []);

  const {
    step: { current },
  } = useStepContext();

  return (
    <div>
      {stepNodeMap[current].element}
    </div>
  );
};

export default function CreatePage() {
  return (
    <FullscreenContainer>
      <StepContextProvider>
        <StepComponent />
      </StepContextProvider>
    </FullscreenContainer>
  );
}
