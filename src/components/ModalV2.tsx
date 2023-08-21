import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from "@chakra-ui/react";

interface IProps {
  visible: boolean;
  children: React.ReactNode;
  id?: string;
  onClose?: any;
  footerComponent: any
}

const ModalV2 = ({ visible, children, onClose, footerComponent, id = nanoid() }: IProps) => {
  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxWidth="1000px" padding="16px">
        <ModalHeader>Risk Disclosure Statement</ModalHeader>
        {/* <ModalCloseButton autoFocus={false} /> */}
        <ModalBody fontSize="16px">
          {children}
        </ModalBody>
        <ModalFooter paddingBottom="0">
          {footerComponent}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
  // return (
  //   <Box
  //     id={id}
  //     position="fixed"
  //     top="0"
  //     left="0"
  //     width="100vw"
  //     height="100vh"
  //     display="flex"
  //     alignItems="center"
  //     justifyContent="center"
  //     zIndex="1"
  //     boxSizing="border-box"
  //   >
  //     <Box
  //       background="white"
  //       maxWidth="1000px"
  //       maxHeight="100vh"
  //       position="relative"
  //       padding="20px"
  //       overflow="scroll"
  //     >
  //       {children}
  //     </Box>
  //   </Box>
  // );
};

export default ModalV2;
