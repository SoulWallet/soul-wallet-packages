import React, { ReactNode } from "react";
import ChevronLeft from "@src/assets/icons/chevron-left.svg";
import Icon from "./Icon";
import { StepActionTypeEn, useStepContext, useStepDispatchContext } from "@src/context/StepContext";
interface IProgressNavBarProps {
    title: string;
    maxStep: number;
    extraRight?: ReactNode;
}

export default function ProgressNavBar({ title, maxStep, extraRight }: IProgressNavBarProps) {
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

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-row items-center ">
                    {current === 0 ? null : <Icon className="mr-1" src={ChevronLeft} onClick={handleBack} />}
                    <span className="font-bold text-xl text-black -tracking-[0.01em]">{title}</span>
                </div>
                {extraRight}
            </div>

            <div className="w-full h-[2px] bg-[#EFEFEF] rounded-sm">
                <div className={`rounded-sm bg-purple h-[2px] w-${Math.round((100 * current) / maxStep)}p`} />
            </div>
        </div>
    );
}
