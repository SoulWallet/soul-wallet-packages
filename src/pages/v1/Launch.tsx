import Button from "@src/components/Button";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ModalV2 from "@src/components/ModalV2";
import Statement, { AUTHORIZED_STORAGE_KEY } from "@src/components/Statement";
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from "@src/context/StepContext";
import useBrowser from "@src/hooks/useBrowser";
import IconClose from '@src/assets/icons/close.svg';
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { Box, Center, Flex, Text, Image } from "@chakra-ui/react";
import CreateWalletIcon from "@src/components/Icons/CreateWallet";
import RecoverWalletIcon from "@src/components/Icons/RecoverWallet";
import React, { useEffect, useState, Fragment } from "react";
import TextButton from "@src/components/web/TextButton";

export default function Launch() {
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useStepDispatchContext();
  const { replaceCurrentTab } = useBrowser();
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
    if (authorized) {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: targetStep,
      });
      replaceCurrentTab(to)
    } else {
      setShowModal(true)
    }
  };

  return (
    <FullscreenContainer>
      <Flex w="352px" direction="column" alignItems="center" padding="10px">
        <Box
          width="100%"
          boxShadow="0px 4px 4px 0px #0000001A"
          borderRadius="10px"
          cursor="pointer"
          background="#E3FD8A"
          color="black"
          padding="20px 40px 20px 20px"
          border="2px solid transparent"
          transition="all 0.3s ease"
          marginBottom="20px"
          _hover={{ border: '2px solid black' }}
          onClick={() => handleJumpToTargetStep(CreateStepEn.CreatePWD, 'create')}
        >
          <Box
            width="44px"
            height="44px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CreateWalletIcon />
          </Box>
          <Box
            width="100%"
            fontSize="24px"
            fontWeight="800"
            marginTop="15px"
            lineHeight="33px"
            marginBottom="4px"
          >
            Create New Wallet
          </Box>
          <Box
            width="100%"
            fontSize="14px"
            fontWeight="700"
            lineHeight="normal"
          >
            Begin your Web3 journey by creating a smart contract wallet with us.
          </Box>
        </Box>
        <Box
          width="100%"
          boxShadow="0px 4px 4px 0px #0000001A"
          borderRadius="10px"
          cursor="pointer"
          background="white"
          color="black"
          padding="20px 40px 20px 20px"
          border="2px solid transparent"
          transition="all 0.3s ease"
          _hover={{ border: '2px solid black' }}
          onClick={() => handleJumpToTargetStep(RecoverStepEn.Start, 'recover')}
        >
          <Box
            width="44px"
            height="44px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <RecoverWalletIcon />
          </Box>
          <Box
            width="100%"
            fontSize="24px"
            fontWeight="800"
            marginTop="15px"
            lineHeight="33px"
            marginBottom="4px"
          >
            Wallet recovery
          </Box>
          <Box
            width="100%"
            fontSize="14px"
            fontWeight="700"
            lineHeight="normal"
          >
            If your wallet is lost, recover easily with guardian signatures.
          </Box>
        </Box>
      </Flex>
      <ModalV2
        visible={showModal}
        onClose={handleCloseModal}
        footerComponent={
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
            {!authorized ? (
              <>
                <Button
                  onClick={handleAuthorize}
                  py="3"
                  px="4"
                  marginBottom="10px"
                >
                  I Understand
                </Button>
                <TextButton
                  onClick={handleCloseModal}
                  _styles={{ fontSize: '16px' }}
                >
                  No, thanks
                </TextButton>
              </>
            ) : (
              <TextButton
                onClick={handleCloseModal}
                _styles={{ fontSize: '16px' }}
              >
                Thank you for your agreement.
              </TextButton>
            )}
          </Box>
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="1em"
          // paddingLeft="0.5em"
          // paddingRight="0.5em"
        >
          <Statement />
        </Box>
      </ModalV2>
    </FullscreenContainer>
  );
}
