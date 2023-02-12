import FullscreenContainer from "@src/components/FullscreenContainer";
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from "@src/context/StepContext";
import React from "react";
import { Link } from "react-router-dom";

export default function Launch() {
    const dispatch = useStepDispatchContext();

    const handleJumpToTargetStep = (targetStep: number) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    return (
        <FullscreenContainer>
            <div className="w-460 flex flex-col justify-center items-center px-62 pt-28 pb-52">
                <Link
                    to="/create?mode=web"
                    className="w-full btn btn-purple btn-purple-primary"
                    onClick={() => handleJumpToTargetStep(CreateStepEn.CreatePWD)}
                >
                    Create Wallet
                </Link>

                {/* TODO: import page? */}
                <Link
                    to="/recover?mode=web"
                    className="btn w-full btn-purple mt-20 mb-16"
                    onClick={() => handleJumpToTargetStep(RecoverStepEn.ResetPassword)}
                >
                    Import Wallet
                </Link>

                <div className="text-gray70">
                    Lost your wallet?{" "}
                    <Link to="/recovery?mode=web" className="font-bold text-purple">
                        Recover it here
                    </Link>
                </div>
            </div>
        </FullscreenContainer>
    );
}
