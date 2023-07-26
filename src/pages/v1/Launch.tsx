import Button from "@src/components/Button";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ModalV2 from "@src/components/ModalV2";
import Statement, { AUTHORIZED_STORAGE_KEY } from "@src/components/Statement";
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from "@src/context/StepContext";
import useBrowser from "@src/hooks/useBrowser";
import IconClose from '@src/assets/icons/close.svg';
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { Center, Flex } from "@chakra-ui/react";
import CreateWalletIcon from "@src/components/Icons/CreateWallet";
import RecoverWalletIcon from "@src/components/Icons/RecoverWallet";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

export default function Launch() {
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useStepDispatchContext();
  const { goWebsite, replaceCurrentTab } = useBrowser();
  const [showModal, setShowModal] = useState(false);

  const getAuthorized = async () => {
    const authorizedStatus = (await getLocalStorage(AUTHORIZED_STORAGE_KEY)) ?? false;
    setAuthorized(authorizedStatus);
    setShowModal(!authorizedStatus);
  };

  useEffect(() => {
    getAuthorized();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAuthorize = () => {
    setLocalStorage(AUTHORIZED_STORAGE_KEY, true);
    setAuthorized(true);
    handleCloseModal();
  };

  const handleJumpToTargetStep = (targetStep: number, to: string) => {
    // if (authorized) {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
    replaceCurrentTab(to)
    // }
  };

  return (
    <FullscreenContainer>
      <Flex w="460px" direction="column" alignItems="center" padding="10px">
        <div
          className="w-full btn-card-primary mb-5"
          onClick={() => handleJumpToTargetStep(CreateStepEn.CreatePWD, '/create')}
        >
          <div><CreateWalletIcon /></div>
          <div className="w-full card-title">Create New Wallet</div>
          <div className="w-full card-text">Begin your Web3 journey by creating a smart contract wallet with us.</div>
        </div>
        <div
          className="w-full btn-card"
          onClick={() => handleJumpToTargetStep(RecoverStepEn.Start, '/recover')}
        >
          <div><RecoverWalletIcon /></div>
          <div className="w-full card-title">Social Recover</div>
          <div className="w-full card-text">Social recovery help you retrieve wallets easily with guardian signatures.</div>
        </div>
      </Flex>
      {/* Risk Disclosure Statement Modal */}
      <ModalV2 visible={showModal} className="bg-white min-w-[800px] relative">
        <img src={IconClose} className="absolute right-6 top-6 cursor-pointer" onClick={handleCloseModal} />
        <div className="flex flex-col items-center gap-4 px-2">
          <Statement />
          {!authorized ? (
            <>
              <Button onClick={handleAuthorize} type="primary" className="w-base">
                I Understand
              </Button>
              <a className="skip-text mb-2" onClick={handleCloseModal}>
                No, thanks
              </a>
            </>
          ) : (
            <span onClick={handleCloseModal} className="cursor-pointer">
              Thank you for your agreement.
            </span>
          )}
        </div>
      </ModalV2>
    </FullscreenContainer>
  );
}
