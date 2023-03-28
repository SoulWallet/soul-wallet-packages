import React from "react";
import config from "@src/config";
import ReceiveModal from "./comp/ReceiveModal";
import { useNavigate } from "react-router-dom";
import IconReceive from "@src/assets/icons/receive.svg";
import IconSend from "@src/assets/icons/send.svg";
import IconReceiveLight from "@src/assets/icons/receive-light.svg";
import IconSendLight from "@src/assets/icons/send-light.svg";

const Button = ({ icon, iconLight, title, onClick }: any) => (
    <a
        className="bg-[#f2f2f2] hover:bg-blue group transition-all hover:text-white py-2 px-5 flex cursor-pointer justify-center items-center gap-2 rounded-[20px]"
        onClick={onClick}
    >
        <img src={icon} className="w-6 h-6 group-hover:hidden" />
        <img src={iconLight} className="w-6 h-6 hidden group-hover:block" />
        {title}
    </a>
);

export default function Actions() {
    const navigate = useNavigate();
    const receiveModalId = "receiveModalId";
    return (
        <div>
            <div className="px-6  grid grid-cols-2 items-center gap-6">
                <label htmlFor={receiveModalId}>
                    <Button title="Receive" icon={IconReceive} iconLight={IconReceiveLight} />
                </label>
                <Button
                    title="Send"
                    icon={IconSend}
                    iconLight={IconSendLight}
                    onClick={() => navigate(`/send/${config.zeroAddress}`)}
                />
            </div>
            <ReceiveModal modalId={receiveModalId} />
        </div>

        // <div className=" w-full flex bg-[#fafafa]">
        //     <label
        //         htmlFor={receiveModalId}
        //         className="w-1/2 select-none flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200"
        //     >
        //         <img className="w-6 mb-2" src={IconReceive} />
        //         <div className="leading-none">Receive</div>
        //     </label>
        //     <Link
        //         to={`/send/${config.zeroAddress}`}
        //         className="w-1/2 select-none flex flex-col justify-center items-center cursor-pointer text-base py-6 hover:bg-gray-200"
        //     >
        //         <img className="w-6 mb-2" src={IconSend} />
        //         <div className="leading-none">Send</div>
        //     </Link>

        // </div>
    );
}
