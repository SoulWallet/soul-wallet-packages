import Button from "@src/components/Button";
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

                <Button
                    // to="/recover?mode=web"
                    disable
                    className="btn w-full btn-purple mt-20 mb-16 cursor-not-allowed"
                    onClick={() => handleJumpToTargetStep(RecoverStepEn.ResetPassword)}
                >
                    Import Wallet
                </Button>

                <div className="text-gray70">
                    Lost your wallet?{" "}
                    <Link
                        to="/recover?mode=web"
                        className="font-bold text-purple"
                        onClick={() => handleJumpToTargetStep(RecoverStepEn.ResetPassword)}
                    >
                        Recover it here
                    </Link>
                </div>
            </div>
        </FullscreenContainer>
    );
}
