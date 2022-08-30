import React, { useState } from "react";
import ReceiveModal from "./comp/ReceiveModal";
import IconReceive from "@src/assets/receive.svg";
import IconSend from "@src/assets/send.svg";

export default function Actions() {
    const [receiveModalVisible, setReceiveModalVisible] =
        useState<boolean>(false);

    const receiveModalId = "receiveModalId";
    return (
        <div className=" w-full flex bg-actions">
            <label
                htmlFor={receiveModalId}
                className="w-1/2 flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200"
            >
                <img className="w-6 mb-2" src={IconReceive} />
                <div>Receive</div>
            </label>
            <a className="w-1/2 flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200">
                <img className="w-6 mb-2" src={IconSend} />
                <div>Send</div>
            </a>

            <ReceiveModal modalId={receiveModalId} onClose={() => {}} />
        </div>
    );
}
