import Button from "@src/components/Button";
import FileUploader from "@src/components/FileUploader";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import { TEMPORARY_GUARDIANS_STORAGE_KEY, setSessionStorageV2 } from "@src/lib/tools";
import useTools from "@src/hooks/useTools";
import React, { useState } from "react";

const GuardiansImporting = () => {
    const [fileValid, setFileValid] = useState(false);
    const { getJsonFromFile } = useTools();

    const dispatch = useStepDispatchContext();

    const handleNext = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: RecoverStepEn.GuardiansChecking,
        });
    };

    const handleFileParseResult = async (file?: File) => {
        if (!file) {
            return;
        }
        const fileJson: any = await getJsonFromFile(file);
        const parseRes = fileJson.guardians;

        setSessionStorageV2(TEMPORARY_GUARDIANS_STORAGE_KEY, JSON.stringify(parseRes));
        setFileValid(true);
    };

    return (
        <div className="flex flex-col items-center pt-6">
            <FileUploader onFileChange={handleFileParseResult} />

            <Button type="primary" className="w-base mx-auto mt-6" disabled={!fileValid} onClick={handleNext}>
                Check guardians parsing results
            </Button>

            <a className="skip-text mx-auto self-center mt-4 mb-6" onClick={handleNext}>
                Input guardians manually
            </a>
        </div>
    );
};

export default GuardiansImporting;
