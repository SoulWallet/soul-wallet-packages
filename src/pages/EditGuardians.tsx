import { useState } from "react";
import Button from "@src/components/Button";
import PayTokenSelect from "@src/components/PayTokenSelect";
import FullscreenContainer from "@src/components/FullscreenContainer";
import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import ProgressNavBar from "@src/components/ProgressNavBar";
import config from "@src/config";
import { useGlobalStore } from "@src/store/global";
import useWallet from "@src/hooks/useWallet";
import { GuardianItem } from "@src/lib/type";
import React, { useRef } from "react";
import useBrowser from "@src/hooks/useBrowser";

const EditGuardians = () => {
    const { guardians, updateFinalGuardians } = useGlobalStore();
    const { updateGuardian } = useWallet();
    const [updating, setUpdating] = useState(false);
    const formRef = useRef<IGuardianFormHandler>(null);
    const [payToken, setPayToken] = useState<string>(config.zeroAddress);
    const { replaceCurrentTab } = useBrowser();

    const handleClickConfirm = async () => {
        const guardianList: GuardianItem[] = (await formRef.current?.submit()) as GuardianItem[];
        if (!guardianList || guardianList.length === 0) {
            return;
        }

        const guardianAddressList = guardianList.map((item: GuardianItem) => item.address);

        setUpdating(true)
        await updateGuardian(guardianAddressList, payToken);
        setUpdating(false)
        // if success update, update global state
        updateFinalGuardians(guardianList);
        replaceCurrentTab("/resave-guardians");
    };

    const handleChangePayToken = (val: string | number) => {
        setPayToken(val as string);
    };

    return (
        <FullscreenContainer>
            <ProgressNavBar title="Edit Guardian List" maxStep={1} />

            <p className="text-base text-gray80 mt-5 mb-2">
                Guardian addresses are only stored locally and will never be shared with us or any third parties.
            </p>

            <div className="pt-4 pb-6 w-1/2">
                <PayTokenSelect value={payToken} onChange={handleChangePayToken} />
            </div>

            <GuardianForm ref={formRef} guardians={guardians} />

            {guardians && <>
                <h1 className="text-black mt-6 mb-1">Threshold</h1>
                <p>
                Any Wallet recovery requires the signature of: <span className="text-purple font-medium">{Math.ceil(guardians.length / 2)}</span> out of{" "}
                {guardians.length} guardians
                </p>
            </>}

            <div className="w-full flex flex-col justify-center items-center my-5">
                <Button type="primary" loading={updating} className="w-base mb-2#4D4D4D" onClick={handleClickConfirm}>
                    Confirm Guardians
                </Button>
                <span className="text-base text-gray60 ">Notice: you may cancel this change in the next 24 hrs.</span>
            </div>
        </FullscreenContainer>
    );
};

export default EditGuardians;
