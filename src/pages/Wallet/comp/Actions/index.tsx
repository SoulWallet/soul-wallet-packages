import React, { useState } from "react";
import config from "@src/config";
import { Link } from "react-router-dom";
import ReceiveModal from "./comp/ReceiveModal";
import IconReceive from "@src/assets/receive.svg";
import IconSend from "@src/assets/send.svg";

export default function Actions({}) {
    const receiveModalId = "receiveModalId";
    return (
        <div className=" w-full flex bg-[#fafafa]">
            <label
                htmlFor={receiveModalId}
                className="w-1/2 flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200"
            >
                <img className="w-6 mb-2" src={IconReceive} />
                <div className="leading-none">Receive</div>
            </label>
            <Link
                to={`/send/${config.zeroAddress}`}
                className="w-1/2 flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200"
            >
                <img className="w-6 mb-2" src={IconSend} />
                <div className="leading-none">Send</div>
            </Link>

            <ReceiveModal modalId={receiveModalId} />
        </div>
    );
}
