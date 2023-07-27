import React, { ChangeEvent, useState } from "react";
import EyeOpen from "@src/assets/icons/eye-open.svg";
import EyeClose from "@src/assets/icons/eye-close.svg";
import classNames from "classnames";
import { Box, Text, Image, Input } from "@chakra-ui/react"

interface IProps {
  label: string;
  value?: string;
  placeholder?: string;
  errorMsg?: string;
  onChange: (value: string) => void;
  _styles?: any;
}

export default function FormInput({
  label,
  value,
  placeholder,
  errorMsg,
  onChange,
  _styles,
  isPassword
}: IProps) {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" {..._styles}>
      {label && (<Box as="label" htmlFor={label}>{label}</Box>)}
      <Box position="relative">
        <Box>
          <Input
            type={visible === false ? "password" : "text"}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleChange}
            borderRadius="1em"
            paddingLeft="1.5rem"
            paddingRight="1.5rem"
            height="3em"
          />
          {visible !== undefined && isPassword && (
            <Box position="absolute" top="0" right="4px" height="100%" width="40px" display="flex" alignItems="center" justifyContent="center" cursor="pointer" zIndex="1">
              <Image
                src={visible ? EyeOpen : EyeClose}
                onClick={() => setVisible((prev: boolean) => !prev)}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Text color="#FF4343" padding="0 10px" fontSize="14px">{errorMsg}</Text>
    </Box>
  );
}

export function DoubleFormInput({
  leftLabel,
  leftValue,
  leftPlaceholder,
  leftErrorMsg,
  leftOnChange,
  rightLabel,
  rightValue,
  rightPlaceholder,
  rightErrorMsg,
  rightOnChange,
  _styles
}: IProps) {
  const handleLeftChange = (e: ChangeEvent<HTMLInputElement>) => {
    leftOnChange(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="row" {..._styles}>
      <Box display="flex" flexDirection="column">
        {leftLabel && (<Box as="label" htmlFor={leftLabel}>{leftLabel}</Box>)}
        <Box position="relative">
          <Box>
            <Input
              type="text"
              placeholder={leftPlaceholder}
              value={leftValue ?? ""}
              onChange={handleLeftChange}
              borderRadius="1em"
              paddingLeft="1.5rem"
              paddingRight="1.5rem"
              height="3em"
            />
          </Box>
        </Box>
        <Text color="#FF4343" padding="0 10px" fontSize="14px">{leftErrorMsg}</Text>
      </Box>
      <Box display="flex" flexDirection="column" {..._styles}>
        {rightLabel && (<Box as="label" htmlFor={rightLabel}>{rightLabel}</Box>)}
        <Box position="relative">
          <Box>
            <Input
              type="text"
              placeholder={rightPlaceholder}
              value={rightValue ?? ""}
              onChange={handleLeftChange}
              borderRadius="1em"
              paddingLeft="1.5rem"
              paddingRight="1.5rem"
              height="3em"
            />
          </Box>
        </Box>
        <Text color="#FF4343" padding="0 10px" fontSize="14px">{rightErrorMsg}</Text>
      </Box>
    </Box>
  );
}