import React from "react";
import InputWrapper from "../InputWrapper";
import MinusIcon from "@src/assets/icons/minus.svg";
import Icon from "../Icon";
import { GuardianItem } from "@src/lib/type";
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import FormInput from "@src/components/web/Form/FormInput";
import { Box } from "@chakra-ui/react"

type IProps = GuardianItem;

export default function GuardianInput({ id, name, address, errorMsg, inputClassName, noNameInput }: IProps) {
  const handleNameChange = (value: string) => {
    // updateNameById(id, value);
  };
  const handleAddressChange = (value: string) => {
    // updateErrorMsgById(id);
    // updateAddressById(id, value);
  };

  const handleDelete = () => {
    // removeGuardian(id);
  };

  console.log('noNameInput', noNameInput)

  return (
    <Box position="relative" width="100%">
      {noNameInput ? (
        <FormInput
          placeholder="Enter guardian address"
          value={address}
          onChange={handleAddressChange}
          errorMsg={errorMsg}
          _styles={{ width: '100%' }}
        />
      ) : (
        <DoubleFormInput
          leftPlaceholder="Enter guardian address"
          leftValue={address}
          leftOnChange={handleAddressChange}
          leftErrorMsg={errorMsg}
          rightPlaceholder="Assign nickname"
          rightValue={name}
          rightOnChange={handleNameChange}
          rightErrorMsg={''}
          _styles={{ width: '100%' }}
        />
      )}
      <Box
        onClick={handleDelete}
        position="absolute"
        width="40px"
        right="-40px"
        top="0"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
      >
        <Icon src={MinusIcon} />
      </Box>
    </Box>
  );
}
