import React from "react";
import { Image, Button, ButtonProps } from "@chakra-ui/react";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error" | "reject" | "link"; // may add 'dash', 'text', 'link', etc. later

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  type?: ButtonType;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  _styles?: any;
}

export default function TextButton({
  onClick,
  children,
  loading,
  disabled,
  type = "default",
  href,
  color,
  _styles,
  ...restProps
}: IProps) {
  const doClick = () => {
    if (!loading && !disabled) {
      if (onClick) onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }

  return (
    <Button
      {...moreProps}
      {...restProps}
      onClick={onClick}
      borderRadius="1em"
      height="3rem"
      fontWeight="bold"
      fontSize="1em"
      _hover={{ bg: 'transparent' }}
      _disabled={{ opacity: '0.7', cursor: 'not-allowed' }}
      isDisabled={disabled}
      bg="transparent"
      color={color || '#898989'}
      {..._styles}
    >
      {children}
    </Button>
  );
}
