import React from "react";
import cn from "classnames";
import { Image, Button, ButtonProps } from "@chakra-ui/react";
import IconLoading from "@src/assets/loading.gif";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error" | "reject" | "link"; // may add 'dash', 'text', 'link', etc. later

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  type?: ButtonType;
  className?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  _styles?: any;
}

export default function TextButton({
  className,
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
      onClick();
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
      color={color}
      {..._styles}
    >
      {loading ? <Image src={IconLoading} /> : children}
    </Button>
  );
}
