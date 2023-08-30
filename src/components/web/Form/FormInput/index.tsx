import React, { ChangeEvent, useState } from "react";
import EyeOpen from "@src/assets/icons/eye-open.svg";
import EyeClose from "@src/assets/icons/eye-close.svg";
import { Box, Text, Image, Input } from "@chakra-ui/react"

interface IProps {
  label?: string;
  value?: string;
  placeholder?: string;
  errorMsg?: string;
  onChange: (value: string) => void;
  onBlur?: any;
  _styles?: any;
  isPassword?: boolean;
  readOnly?: boolean;
  RightIcon?: any;
  autoFocus?: any;
  onEnter?: any;
}

export default function FormInput({
  label,
  value,
  placeholder,
  errorMsg,
  onChange,
  onBlur,
  _styles,
  isPassword,
  RightIcon,
  readOnly,
  autoFocus,
  onEnter
}: IProps) {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const onKeyDown = (event: any) => {
    if (event.keyCode === 13 && onEnter) {
      onEnter();
    }
  }

  return (
    <Box display="flex" flexDirection="column" {..._styles}>
      {label && (<Box as="label" htmlFor={label}>{label}</Box>)}
      <Box position="relative">
        <Box>
          <Input
            type={(isPassword && !visible) ? "password" : "text"}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            borderRadius="1em"
            paddingLeft="1.5rem"
            paddingRight={isPassword ? '2rem' : '1.5rem'}
            height="3em"
            readOnly={readOnly}
            autoFocus={autoFocus}
          />
          {visible !== undefined && isPassword && (
            <Box position="absolute" top="0" right="4px" height="100%" width="40px" display="flex" alignItems="center" justifyContent="center" cursor="pointer" zIndex="1">
              <Image
                src={visible ? EyeOpen : EyeClose}
                onClick={() => setVisible((prev: boolean) => !prev)}
              />
            </Box>
          )}
          {RightIcon && (
            <Box position="absolute" top="0" right="4px" height="100%" width="40px" display="flex" alignItems="center" justifyContent="center" cursor="pointer" zIndex="1">
              {RightIcon}
            </Box>
          )}
        </Box>
      </Box>
      <Text color="#FF4343" padding="0 10px" fontSize="14px">{errorMsg}</Text>
    </Box>
  );
}
