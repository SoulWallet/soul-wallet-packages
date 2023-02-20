import React, { useState } from "react";

export type OptionItem = {
    label: string;
    value: number | string;
};

interface IProps {
    placeholder?: string;
    className?: string;
    options: OptionItem[];
    onChange: (val: number | string) => void;
}

const Dropdown = ({ placeholder, options, onChange }: IProps) => {
    const [selectedItem, setSelectedItem] = useState<OptionItem>();

    const handleChangeSelect = (item: OptionItem) => {
        (document.activeElement as any)?.blur();
        setSelectedItem(item);
        onChange(item.value);
    };

    return (
        <div className="w-full dropdown h-12 bg-lightWhite border border-lightGray rounded-3xl text-base">
            <label tabIndex={0} className="flex place-items-center h-12 px-6 mb-[2px]">
                {selectedItem?.label ?? placeholder}
            </label>

            <ul tabIndex={0} className="bg-white dropdown-content compact menu shadow w-full rounded-md">
                {options.map((item) => (
                    <li key={item.value} onClick={() => handleChangeSelect(item)}>
                        <a>{item.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
