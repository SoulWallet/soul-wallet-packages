import React from "react";
import cn from "classnames";
import { ICostItem } from "@src/types/IAssets";
import { EnAlign } from "@src/types/IAssets";

const alignMapping = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
};

export default function CostItem({ label, value, memo, loading, align = EnAlign.Right }: ICostItem) {
    return (
        <div className={cn("flex flex-col", alignMapping[align])}>
            {label && <div className="text-gray60">{label}</div>}
            {loading && <div>Loading</div>}
            {!loading && (
                <>
                    {value && <div className="text-black text-lg font-bold mt-2 leading-none">{value}</div>}
                    {memo && <div className="text-black text-sm mt-2 leading-none">{memo}</div>}
                </>
            )}
        </div>
    );
}
