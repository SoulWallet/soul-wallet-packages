import Button from "@src/components/Button";
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React from "react";
import { Link } from "react-router-dom";

export default function Launch() {
    const dispatch = useStepDispatchContext();

    const handleJumpToCreatePassword = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: CreateStepEn.CreatePWD,
        });
    };
    return (
        <div className="w-460 flex flex-col justify-center items-center px-62 pt-28 pb-52">
            <Button classNames="btn-purple btn-purple-primary" onClick={handleJumpToCreatePassword}>
                Create Wallet
            </Button>

            <Link to="/recovery" className="btn w-full btn-purple mt-20 mb-16">
                Import Wallet
            </Link>

            <div className="text-gray70">
                Lost your wallet?{" "}
                <Link to="/recovery" className="font-bold text-purple">
                    Recover it here
                </Link>
            </div>
        </div>
    );
}
