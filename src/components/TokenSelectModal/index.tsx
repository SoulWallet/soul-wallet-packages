import React, { useState } from "react";
import { ITokenSelectModal } from "../../types/IModal";
import config from "@src/config";
import Modal from "../Modal";

export function TokenSelectModal({ onCancel }: ITokenSelectModal) {
    return (
        <Modal onCancel={onCancel}>
            <div>
                {config.assetsList.map((item: any) => (
                    <div>{item.symbol}</div>
                ))}
            </div>
        </Modal>
    );
}
