import Button from "@src/components/Button";
import FileUploader from "@src/components/FileUploader";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { TEMPORARY_GUARDIANS_STORAGE_KEY, setSessionStorageV2 } from "@src/lib/tools";
import React, { useState } from "react";

const GuardiansImporting = () => {
    const [fileValid, setFileValid] = useState(false);

    const dispatch = useStepDispatchContext();

    const handleNext = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.GuardiansChecking,
        });
    };

    const handleFileParseResult = (file?: File) => {
        // TODO: parse file here

        // mock logic 👇
        const parseRes = [
            {
                name: "test",
                address: "0x1231249ef092403431249ef0924034abadf09240",
                id: "1",
            },
        ];

        setSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY, JSON.stringify(parseRes));
        setFileValid(true);
    };

    return (
        <div className="flex flex-col items-center pt-6">
            <FileUploader onFileChange={handleFileParseResult} />

            <Button type="primary" className="w-base mx-auto mt-6" disable={!fileValid} onClick={handleNext}>
                Check guardians parsing results
            </Button>

            <a className="skip-text mx-auto self-center mt-4 mb-6" onClick={handleNext}>
                Input guardians manually
            </a>
        </div>
    );
};

export default GuardiansImporting;
