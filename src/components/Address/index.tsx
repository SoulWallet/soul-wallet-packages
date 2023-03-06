import React from "react";
interface IAddress {
    value: string;
}
export default function Address({ value }: IAddress) {
    return <div className="rounded-lg bg-gray20 break-words p-3 address text-[rgba(0,0,0,.6)]">{value}</div>;
}
