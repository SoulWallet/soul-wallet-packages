import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

interface IProps {
    visible: boolean;
    children: React.ReactNode;
    id?: string;
    className?: string;
}

const Modal = ({ visible, children, id = nanoid(), className }: IProps) => {
    const [modalClassName, setModalClassName] = useState("modal-close");

    useEffect(() => {
        setModalClassName(visible ? "modal-open z-10" : "modal-close -z-10");
    }, [visible]);

    return (
        <>
            {/* {maskCloseable ? <input type="checkbox" id={id} className="modal-toggle" /> : null} */}

            <div className={"modal " + modalClassName} id={id}>
                <div className={"modal-box " + className}>{children}</div>
            </div>
        </>
    );
};

export default Modal;
