import React, { ReactNode, useEffect, useState } from "react";
import chevron_left_icon from "@src/assets/icons/chevron-left.svg";
import question_icon from "@src/assets/icons/question-mark.svg";
import Icon from "./Icon";
import { StepActionTypeEn, useStepContext, useStepDispatchContext } from "@src/context/StepContext";
import classNames from "classnames";
import Button from "./Button";
interface IProgressNavBarProps {
    title: string;
    maxStep: number;
    hint?: ReactNode;
}

export default function ProgressNavBar({ title, maxStep, hint }: IProgressNavBarProps) {
    const [showHint, setShowHint] = useState(true);
    const dispatch = useStepDispatchContext();
    const {
        step: { current },
    } = useStepContext();

    const handleBack = () => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: current - 1,
        });
    };

    const handleClickHint = () => {
        setShowHint(true);
    };

    const handleCloseHint = () => {
        setShowHint(false);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row mb-2 items-center">
                <div className="flex flex-row items-center ">
                    {current === 0 || current === maxStep ? null : (
                        <Icon className="mr-1" src={chevron_left_icon} onClick={handleBack} />
                    )}
                    <span className="font-bold text-xl text-black -tracking-[0.01em]">{title}</span>
                </div>

                {hint ? (
                    <div className="relative cursor-pointer w-6 h-6 ml-1">
                        <div
                            className={classNames("absolute  rounded-full", showHint && "bg-white z-20 ")}
                            onClick={handleClickHint}
                        >
                            <Icon className="w-4 h-4" src={question_icon} />
                        </div>

                        {showHint ? (
                            <div>
                                <div className="absolute top-7 z-30 ">
                                    <div className="translate-x-1/4 border-solid border-b-white border-b-8 border-x-transparent border-x-8 w-4 border-t-0 " />
                                    <div className="-translate-x-1/3 p-6  rounded-lg bg-white flex flex-col">
                                        {hint}
                                        <Button
                                            type="primary"
                                            className="w-32 mt-6 self-center place-self-center"
                                            onClick={handleCloseHint}
                                        >
                                            OK
                                        </Button>
                                    </div>
                                </div>
                                <div className="fixed inset-0 bg-slate-900 opacity-60 z-10" />
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>

            <div className="w-full h-[2px] bg-[#EFEFEF] rounded-sm">
                <div className={`rounded-sm bg-purple h-[2px] w-${Math.round((100 * current) / maxStep)}p`} />
            </div>
        </div>
    );
}
