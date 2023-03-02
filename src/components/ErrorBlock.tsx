import React from "react";
import empty_img from "@src/assets/empty.svg";

interface IErrorBlockProps {
    onRefresh: () => void;
}

const ErrorBlock = ({ onRefresh }: IErrorBlockProps) => {
    return (
        <div className="flex flex-col items-center w-full px-28 py-6">
            <img src={empty_img} className="w-48 h-48" />
            <div className="font-bold mt-2">
                <span>Something wrong, </span>
                <a className="text-purple" onClick={onRefresh}>
                    Click to refresh
                </a>
            </div>
        </div>
    );
};

export default ErrorBlock;
