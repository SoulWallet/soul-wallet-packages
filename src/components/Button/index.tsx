import React from "react";
import cn from "classnames";
import { Button as CButton, ButtonProps, Image } from "@chakra-ui/react";
import IconLoading from "@src/assets/loading.gif";

// TODO: error & retry
type ButtonType = "default" | "primary" | "disabled" | "error" | "reject" | "link"; // may add 'dash', 'text', 'link', etc. later

interface IProps extends Omit<ButtonProps, "type"> {
    children: React.ReactNode;
    type?: ButtonType; // 不传使用旧button，传了代表使用淡紫色新button
    className?: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    href?: string;
}

export default function Button({
    className,
    onClick,
    children,
    loading,
    disabled,
    type = "default",
    href,
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
        <CButton
            color="#fff"
            bg={"brand.red"}
            _hover={{ bg: "brand.redDarken" }}
            h="unset"
            transition={"all 0.2s ease-in-out"}
            _disabled={{ opacity: "0.5", cursor: "not-allowed" }}
            onClick={doClick}
            rounded={"20px"}
            lineHeight={"1"}
            isDisabled={disabled}
            {...moreProps}
            {...restProps}
        >
            {children}
            {loading && <Image src={IconLoading} w="20px" h="20px" ml="1" />}
        </CButton>
    );
}
