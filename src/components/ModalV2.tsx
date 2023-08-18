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
}

const ModalV2 = ({ visible, children, onClose, id = nanoid() }: IProps) => {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="800px">
        <ModalHeader>Risk Disclosure Statement</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="16px">
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )

  return (
    <Box
      id={id}
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1"
      boxSizing="border-box"
    >
      <Box
        background="white"
        maxWidth="800px"
        maxHeight="100vh"
        position="relative"
        padding="20px"
        overflow="scroll"
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModalV2;
