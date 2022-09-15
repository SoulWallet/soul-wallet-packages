import React from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

interface AddressIconProps {
    width: number;
    address: string;
}

export default function AddressIcon({ width, address }: AddressIconProps) {
    return <Jazzicon diameter={width} seed={jsNumberForAddress(address)} />;
}
