import React, { useState, useEffect } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { IModalProps } from "@src/types/IModal";
import ReceiveCode from "@src/components/ReceiveCode";

export default function ReceiveModal({ modalId }: IModalProps) {
    const { walletAddress } = useWalletContext();

    return (
        <div>
            <input type="checkbox" id={modalId} className="modal-toggle" />
            <label className="modal" htmlFor={modalId}>
                <label
                    htmlFor=""
                    className="modal-box w-11/12 max-w-5xl flex flex-col items-center py-8"
                >
                    <ReceiveCode walletAddress={walletAddress} />
                </label>
            </label>
        </div>
    );
}
