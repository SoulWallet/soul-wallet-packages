import React, { useState, DragEvent, ChangeEvent } from "react";
import file_icon from "@src/assets/icons/document-text.svg";
import classNames from "classnames";

enum UploadStatusEn {
    None,
    Error,
    Loading,
    Success,
}

const FileUploader = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState<UploadStatusEn>(UploadStatusEn.None);
    const [file, setFile] = useState<File>();

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(false);

        setFile(e.dataTransfer.files[0]);

        handleUpload();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
        handleUpload();
    };

    const handleUpload = () => {
        // TODO: file upload
        // setStatus(UploadStatusEn.Loading);
        // upload -> parse -> guardians[] -> store
    };
    return (
        <div
            className={classNames(
                "rounded-16 bg-lightWhite px-95 py-16 cursor-pointer relative",
                isActive && "brightness-90",
            )}
            onDrop={handleDrop}
            onDragEnter={() => setIsActive(true)}
            onDragLeave={() => setIsActive(false)}
        >
            <img src={file_icon} className="w-24 h-24 place-content-center mx-auto mb-10" />

            <div className=" text-center">
                {status === UploadStatusEn.None && (
                    <p className="text-sm ">Click or drag file to this area to upload</p>
                )}
                {status === UploadStatusEn.Loading && (
                    <>
                        <div className="progress-bar"></div>
                        <p className="w-full mt-4 text-xs">Uploading...</p>
                    </>
                )}

                {status === UploadStatusEn.Error && (
                    <>
                        <span className="text-alarmRed mr-4">Error</span>
                        <a className="link text-purple" onClick={handleUpload}>
                            Click to reupload
                        </a>
                    </>
                )}

                {status === UploadStatusEn.Success && <>{file?.name}</>}
            </div>

            <input
                type="file"
                id="file"
                className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploader;
