import React, { useState } from "react";
import { useSettingStore } from "@src/store/settingStore";
import { shallow } from "zustand/shallow";
import { toast } from "material-react-toastify";
import IconArrowBack from "@src/assets/arrow-left.svg";
import { Input } from "@src/components/Input";
import Button from "@src/components/Button";

interface IBundlerUrl {
    onChange: (index: number) => void;
    onCancel: () => void;
}

export default function BundlerUrl({ onChange, onCancel }: IBundlerUrl) {
    const [bundlerUrl, setBundlerUrl] = useSettingStore(
        (state: any) => [state.bundlerUrl, state.setBundlerUrl],
        shallow,
    );

    const [tempUrl, setTempUrl] = useState(bundlerUrl);

    const doConfirm = () => {
        //valid url first
        setBundlerUrl(tempUrl);
        toast.success("Updated Bundler URL");
        onChange(0);
        onCancel();
    };

    return (
        <div className="px-6 pt-3 pb-8">
            <img src={IconArrowBack} className="cursor-pointer w-6 mb-2" onClick={() => onChange(0)} />

            <div className="text-black text-lg font-bold mb-3">Bundler URL</div>
            <div className="flex flex-col gap-4">
                <Input labelColor="text-black" value={tempUrl} onChange={setTempUrl} error="" />

                <Button onClick={doConfirm} className="btn-blue mt-1">
                    Confirm
                </Button>
            </div>
        </div>
    );
}
