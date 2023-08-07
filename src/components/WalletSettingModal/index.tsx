import React, { useState } from "react";
import useKeyring from "@src/hooks/useKeyring";
import IconClose from "@src/assets/icons/close.svg";
import { IWalletSettingModal } from "@src/types/IModal";
import Modal from "../Modal";
import SettingLinks from "./comp/SettingLinks";
import ResetPassword from "./comp/ResetPassword";
import useWalletContext from "@src/context/hooks/useWalletContext";

export default function WalletSettingModal({ onCancel }: IWalletSettingModal) {
    const keyStore = useKeyring();
    const { showLocked } = useWalletContext();
    const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

    const doLockWallet = async () => {
        await keyStore.lock();
        onCancel();
        showLocked();
    };

    const ModalNavBar = () => {
        return (
            <div className="flex items-center justify-between px-6 py-4 border-b border-color w-full">
                <div className="font-bold text-black text-lg">Setting</div>
                <div className="flex items-center gap-2">
                    <a onClick={doLockWallet} className="btn-trans select-none">
                        Lock
                    </a>
                    <img src={IconClose} className="w-6 h-6 cursor-pointer" onClick={onCancel} />
                </div>
            </div>
        );
    };

    return (
        <Modal className="top-0 left-0 right-0 rounded-t-none" onCancel={onCancel}>
            <ModalNavBar />
            {currentModalIndex === 0 && <SettingLinks onChange={setCurrentModalIndex} />}
            {currentModalIndex === 1 && <ResetPassword onCancel={onCancel} onChange={setCurrentModalIndex} />}
        </Modal>
    );
}
