import React from "react";
import config from "@src/config";

const StatusCircle = () => {
    return (
        <div className="rounded-full border border-gray90 p-[2px]">
            <div className="rounded-full w-2 h-2 bg-green" />
        </div>
    );
};

export default function ChainSelect() {
    return (
        <div className="border border-gray90 rounded-full text-xs py-[6px] px-2 flex items-center gap-[6px] absolut leading-none left-0 right-0 mx-auto">
            <StatusCircle />
            {config.chainName}
        </div>
    );
}
