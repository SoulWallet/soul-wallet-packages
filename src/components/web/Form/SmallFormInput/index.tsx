import React, { ChangeEvent, useState } from "react";
import EyeOpen from "@src/assets/icons/eye-open.svg";
import EyeClose from "@src/assets/icons/eye-close.svg";
import classNames from "classnames";
import { Box, Text, Image, Input } from "@chakra-ui/react"

interface IProps {
  label?: string;
  value?: string;
  placeholder?: string;
  errorMsg?: string;
  onChange: (value: string) => void;
  onBlur?: any;
  _styles?: any;
  RightComponent?: any;
}

export default function FormInput({
  label,
  value,
  placeholder,
  errorMsg,
  onChange,
  onBlur,
  _styles,
  RightComponent
}: IProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" position="relative" {..._styles}>
      {label && (<Box as="label" htmlFor={label}>{label}</Box>)}
      <Box position="relative">
        <Box>
          <Input
            type="text"
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={onBlur}
            borderRadius="1em"
            paddingLeft="1.5rem"
            paddingRight="1.5rem"
            height="3em"
          />
        </Box>
        <Box position="absolute" top="0" right="10px" height="100%" display="flex" alignItems="center" justifyContent="center">
          {RightComponent}
        </Box>
      </Box>
      <Text color="#FF4343" padding="0 10px" fontSize="14px">{errorMsg}</Text>
    </Box>
  );
}
