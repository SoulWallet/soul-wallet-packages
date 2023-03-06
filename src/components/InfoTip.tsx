import React from 'react'
import IconInfo from "@src/assets/icons/info.svg";


type IInfoTip = {
    title: string;
}

export default function InfoTip({
    title
}: IInfoTip){
    return <div
    className="cursor-pointer tooltip tooltip-right"
    data-tip={
        title
    }
>
    <img src={IconInfo} className="w-4 h-4" />
</div>
}