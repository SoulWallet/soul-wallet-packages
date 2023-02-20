import React, { useState } from "react";
import IconClose from "@src/assets/icons/close.svg";
import Modal from "../Modal";
import { IAccountSettingModal } from "@src/types/IModal";
import SettingLinks from "./comp/SettingLinks";

export default function AccountSettingModal({
    onCancel,
}: IAccountSettingModal) {
    const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

    const ModalNavBar = () => {
        return (
            <div className="flex items-center justify-between p-4 border-b border-color w-full">
                <div className="font-bold text-black text-lg">Account 1</div>
                <div className="flex items-center gap-2">
                    <img
                        src={IconClose}
                        className="w-6 h-6 cursor-pointer"
                        onClick={onCancel}
                    />
                </div>
            </div>
        );
    };

    return (
        <Modal className="top-[150px] right-6 w-64" onCancel={onCancel}>
            <ModalNavBar />
            {currentModalIndex === 0 && (
                <SettingLinks onChange={setCurrentModalIndex} />
            )}
        </Modal>
    );
}
