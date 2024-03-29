import React, { useEffect } from "react";
import { createPortal } from 'react-dom'
import useBrowser from "@src/hooks/useBrowser";
import {EnHandleMode} from '@src/lib/type'
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import {motion} from 'framer-motion'
import animationData from './particle.json';
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import LogoIcon from "@src/assets/logo-v3.svg";
import CurveArrowIcon from "@src/components/Icons/CurveArrow";
import BrowserPinIcon from "@src/assets/pinIcon.png";
import BackgroundImage from "@src/assets/success-background.png";
import PluginIcon from "@src/components/Icons/Plugin";
import PinIcon from "@src/components/Icons/Pin";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData
}

interface IStepCompletion {
  mode: EnHandleMode;
}

const SetWalletSuccess = ({ mode }: IStepCompletion) => {
  const {goPlugin} = useBrowser();

  if (mode === EnHandleMode.Create) {
    return (
      <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" position="relative" paddingBottom="20px">
        <Heading1>Congratulations!</Heading1>
        <Box marginBottom="2em">
          <TextBody maxWidth="400px" textAlign="center">
            You're now ready to navigate Ethereum with security and simplicity thanks to your new Soul Wallet.
          </TextBody>
        </Box>
        <Button onClick={() => {
          goPlugin(`activate`)
        }} _styles={{ width: '100%', marginTop: '0.75em' }}>
          Activate Wallet
        </Button>
        {createPortal(
          <Box
            width="100hv"
            height="100wv"
          >
            <Image
              width="100%"
              src={BackgroundImage}
            />
          </Box>, (document.getElementById('animation-portal')) as any
        )}
        <Box
          as={motion.div}
          initial={{opacity: 0, scale: 0.5}}
          whileInView={{opacity: 1, scale: 1, transition: {delay: 2}}}
          position="fixed"
          width="390px"
          height="124px"
          top="50px"
          right="30px"
          background="radial-gradient(51.95% 100% at 100% 100%, #A3B2FF 0%, #E2FC89 100%), linear-gradient(113.16deg, rgba(244, 255, 176, 0.8) 2.41%, rgba(182, 255, 108, 0.8) 76.58%)"
          boxShadow="0px 4.87874698638916px 9.75749397277832px 0px #0000001F"
          borderRadius="30px"
          padding="20px"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
            height="100%"
            position="relative"
          >
            <Box
              position="absolute"
              right="56px"
              top="-54px"
            >
              <PluginIcon />
            </Box>
            <Box
              position="absolute"
              right="50px"
              top="-30px"
            >
              <CurveArrowIcon />
            </Box>
            <Box
              position="absolute"
              right="-15px"
              top="-15px"
            >
              <PinIcon />
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              marginRight="20px"
            >
              <Image width="52px" src={LogoIcon as any} alt="Logo" />
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
            >
              <Box
                color="#29510A"
                fontSize="12px"
                background="white"
                borderRadius="20px"
                padding="0 10px"
                marginBottom="6px"
                fontWeight="600"
                fontFamily="Martian"
              >
                {`WELCOME!`}
              </Box>
              <Box
                color="#29510A"
                fontWeight="600"
                fontFamily="Martian"
              >
                PIN SOUL WALLET HERE!
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return null
};

export default SetWalletSuccess;
