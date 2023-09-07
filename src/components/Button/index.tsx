import React from "react";
import { Button as CButton, ButtonProps, Image } from "@chakra-ui/react";
import IconLoading from "@src/assets/loading.gif";

interface IProps extends Omit<ButtonProps, "type"> {
    children: React.ReactNode;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    href?: string;
}

export default function Button({ onClick, children, loading, disabled, href, ...restProps }: IProps) {
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
            _disabled={{ bg: "#898989", cursor: "not-allowed" }}
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
