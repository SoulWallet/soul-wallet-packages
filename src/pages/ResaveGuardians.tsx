import Button from "@src/components/Button";
import FullscreenContainer from "@src/components/FullscreenContainer";
import GuardiansSaver from "@src/components/GuardiansSaver";
import useBrowser from "@src/hooks/useBrowser";
import { toast } from "material-react-toastify";
import React, { useState } from "react";

const ResaveGuardians = () => {
    const [saved, setSaved] = useState(false);
    const { replaceCurrentTab } = useBrowser();

    const handleSaved = () => {
        setSaved(true);
    };
    const handleNext = () => {
        toast.success("Guardians saved successfully! Redirecting to the launch page...");

        setTimeout(() => {
            // goWebsite("/launch");
            replaceCurrentTab("/launch");
        }, 2000);
    };

    return (
        <FullscreenContainer>
            <div className="flex flex-col pb-14">
                <h1 className="text-lg text-black font-bold">Save your new guardians</h1>
                <p className="tip-text my-4">
                    Congratulations! You have updated your guardians. We strongly recommend you to make sure you have
                    the copy saved.
                </p>

                <GuardiansSaver onSave={handleSaved} />

                <Button className="w-base mt-14 mx-auto" type="primary" disabled={!saved} onClick={handleNext}>
                    Next
                </Button>
            </div>
        </FullscreenContainer>
    );
};

export default ResaveGuardians;
