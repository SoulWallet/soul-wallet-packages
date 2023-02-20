import React, { useState, DragEvent, ChangeEvent } from "react";
import file_icon from "@src/assets/icons/document-text.svg";
import classNames from "classnames";

enum UploadStatusEn {
    None,
    Error,
    Loading,
    Success,
}

interface IFileUploaderProps {
    onFileChange: (file: File) => void;
}

const FileUploader = ({ onFileChange }: IFileUploaderProps) => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState<UploadStatusEn>(UploadStatusEn.Success);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(false);

        const file =
            (e as DragEvent<HTMLDivElement>)?.dataTransfer?.files?.[0] ||
            (e as ChangeEvent<HTMLInputElement>)?.target?.files?.[0];

        onFileChange(file);
    };

    const handleReset = () => {
        setStatus(UploadStatusEn.None);
    };

    return (
        <div
            className={classNames(
                "w-full rounded-2xl bg-lightWhite px-24 py-4 cursor-pointer relative",
                isActive && "brightness-90",
            )}
            onDrop={handleFileChange}
            onDragEnter={() => setIsActive(true)}
            onDragLeave={() => setIsActive(false)}
        >
            <img src={file_icon} className="w-6 h-6 place-content-center mx-auto mb-2" />

            <div className=" text-center">
                {status === UploadStatusEn.None && <p className="text-sm ">Click or drag file to this area to load</p>}
                {status === UploadStatusEn.Loading && (
                    <>
                        <div className="progress-bar"></div>
                        <p className="w-full mt-1 text-xs">loading...</p>
                    </>
                )}

                {status === UploadStatusEn.Error && (
                    <>
                        {/* TODO: error reason */}
                        <span className="text-alarmRed mr-1">Error</span>
                        <a className="link text-purple" onClick={handleReset}>
                            Click to reload
                        </a>
                    </>
                )}

                {/* TODO: tip */}
                {status === UploadStatusEn.Success && <>Success</>}
            </div>

            <input
                type="file"
                id="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploader;
