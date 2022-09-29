import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@src/lib/api";
import useWalletContext from "@src/context/hooks/useWalletContext";
import Button from "@src/components/Button";
import { Input } from "../Input";
import { toast } from "material-react-toastify";
import {
    getLocalStorage,
    setGuardianName,
    setLocalStorage,
} from "@src/lib/tools";

interface ErrorProps {
    name: string;
    address: string;
}

const errorDefaultValues = {
    name: "",
    address: "",
};

export default function AddGuardians() {
    const { walletAddress, addGuardian } = useWalletContext();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorProps>(errorDefaultValues);

    const checkParams = () => {
        let flag = true;

        if (!name) {
            setErrors((prev) => ({
                ...prev,
                name: "Please enter name",
            }));
            flag = false;
        }
        if (!address) {
            setErrors((prev) => ({
                ...prev,
                address: "Please enter address",
            }));
            flag = false;
        }
        return flag;
    };

    const doAdd = async () => {
        // clear previous errors
        setErrors(errorDefaultValues);
        if (checkParams()) {
            setLoading(true);
            await addGuardian(address);
            const res: any = await api.guardian.add({
                email: await getLocalStorage("email"),
                wallet_address: walletAddress,
                guardian: address,
            });
            if (res.code === 200) {
                setGuardianName(address, name);
                toast.success("Added guardian");
                setLoading(false);
                navigate("/wallet");
            }
        }
    };

    return (
        <div className="p-4 pt-0">
            <div className="page-title mb-4">Add Guardian</div>

            <div className="form-control w-full">
                <div className="mb-2">
                    <Input
                        label="Name"
                        error={errors.name}
                        value={name}
                        onChange={(val) => {
                            setName(val);
                            setErrors((prev) => ({
                                ...prev,
                                name: "",
                            }));
                        }}
                    />
                </div>
                <div className="mb-10">
                    <Input
                        label="Address"
                        error={errors.address}
                        value={address}
                        onChange={(val) => {
                            setAddress(val);
                            setErrors((prev) => ({
                                ...prev,
                                address: "",
                            }));
                        }}
                    />
                </div>

                <Button classNames="btn-blue" loading={loading} onClick={doAdd}>
                    Confirm
                </Button>
            </div>
        </div>
    );
}
