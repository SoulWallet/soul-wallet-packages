import { usePasswordStrength } from "@src/hooks/usePasswordStrength";
import React from "react";
import { Text, Box } from "@chakra-ui/react"
import classNames from "classnames";

interface IPasswordStrengthBarProps {
  password: string;
  className?: string;
  _styles?: any;
}

const PasswordStrengthBar = ({ password, className, _styles }: IPasswordStrengthBarProps) => {
  const passwordStrength = usePasswordStrength(password);

  if (!(password.length && passwordStrength >= 0)) {
    return null
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginTop="1em" {..._styles}>
      <Box display="flex" flexDirection="row" width="calc(100% - 80px)" height="0.25rem" justifyContent="space-evenly" paddingLeft="1em" columnGap="0.25em">
        <Text
          flex="1"
          borderRadius="0.125rem"
          background={(password?.length && passwordStrength >= 0) ? '#E83D26' : 'transparent'}
        />
        <Text
          flex="1"
          borderRadius="0.125rem"
          background={(passwordStrength > 2) ? '#DB9E00' : 'transparent'}
        />
        <Text
          flex="1"
          borderRadius="0.125rem"
          background={(passwordStrength > 3) ? '#48BE93' : 'transparent'}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" width="80px" paddingRight="1em">
        {passwordStrength <= 2 && <Box fontSize="0.875rem" lineHeight="1.25rem" fontWeight="bold" color="#E83D26">Weak</Box>}
        {passwordStrength > 2 && passwordStrength <= 3 && <Box fontSize="0.875rem" lineHeight="1.25rem" fontWeight="bold" color="#DB9E00">Moderate</Box>}
        {passwordStrength > 3 && <Box fontSize="0.875rem" lineHeight="1.25rem" fontWeight="bold" color="#48BE93">Strong</Box>}
      </Box>
    </Box>
  );
};

export default PasswordStrengthBar;
