import React, { useState, useEffect } from "react";
import cn from "classnames";

export type OptionItem = {
    label: string;
    value: number | string;
};

interface IProps {
    placeholder?: string;
    className?: string;
    options: OptionItem[];
    value?: number;
    disabled?: boolean;
    onChange: (val: number | string) => void;
}

const Dropdown = ({ placeholder, options, disabled, value, onChange }: IProps) => {
    const [selectedItem, setSelectedItem] = useState<OptionItem>();

    const handleChangeSelect = (item: OptionItem) => {
        (document.activeElement as any)?.blur();
        setSelectedItem(item);
        onChange(item.value);
    };

    useEffect(() => {
        if (!value) {
            return;
        }
        const filtered = options.filter((item) => item.value === value)[0];
        setSelectedItem(filtered);
        onChange(filtered.value);
    }, [value]);

    return (
        <div
            className={cn(
                "w-full dropdown h-12 bg-lightWhite border border-lightGray rounded-3xl text-base",
                disabled && "cursor-no-drop",
            )}
        >
            <label tabIndex={0} className="flex place-items-center h-12 px-6 mb-[2px]">
                {selectedItem?.label ?? placeholder}
            </label>

            {!disabled && (
                <ul tabIndex={0} className="bg-white dropdown-content compact menu shadow w-full rounded-md">
                    {options.map((item) => (
                        <li key={item.value} onClick={() => handleChangeSelect(item)}>
                            <a>{item.label}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
