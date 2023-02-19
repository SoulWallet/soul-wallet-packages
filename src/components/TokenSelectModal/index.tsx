import React from "react";
import { ITokenSelectModal } from "../../types/IModal";
import config from "@src/config";
import Modal from "../Modal";

export function TokenSelectModal({ onCancel }: ITokenSelectModal) {
    return (
        <Modal
            onCancel={onCancel}
            className="left-6 right-6 top-0 bottom-0 m-auto flex flex-col h-[350px] py-3 overflow-hidden"
        >
            {config.assetsList.map((item: any) => (
                <div className="py-2 px-4 hover:bg-gray40 cursor-pointer flex items-center gap-1">
                    <img src={item.icon} className="w-8 h-8" />
                    <div className="text-black">
                        <div className="text-black text-lg mb-[2px] font-bold leading-none">
                            {item.symbol}
                        </div>
                        <div className="text-xs">
                            Balance: 100000 {item.symbol}
                        </div>
                    </div>
                </div>
            ))}
        </Modal>
    );
}
