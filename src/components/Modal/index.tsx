import React from "react";
import cn from "classnames";

export default function Modal({ children, onCancel, className }: any) {
    return (
        <div
            className="bg-[rgba(0,0,0,.6)] backdrop-blur-[5px] absolute top-0 left-0 right-0 bottom-0 z-30"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "bg-white navbar-shadow rounded-2xl absolute",
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}
