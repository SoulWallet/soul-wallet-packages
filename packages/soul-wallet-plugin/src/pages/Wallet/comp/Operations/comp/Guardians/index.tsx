import React from "react";
import { Link } from "react-router-dom";
import IconAdd from "@src/assets/add.svg";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import IconChevronRight from "@src/assets/chevron-right.svg";

interface IGuardian {
    icon: string;
    name: string;
    address: string;
}

const guardianList: IGuardian[] = [
    {
        icon: "",
        name: "Guardian 1",
        address: "0x1b5cf860506c6291711478F54123312066944B3",
    },
    {
        icon: "",
        name: "Guardian 2",
        address: "0x4b5cf860506c6291765478F54123312066944B2",
    },
    {
        icon: "",
        name: "Guardian 3",
        address: "0x5b5cf860506c62914211478F54123312066944B1",
    },
    {
        icon: "",
        name: "Guardian 4",
        address: "0x9b5cf860506c6265311478F54123312066944B8",
    },
];

export default function Assets() {
    return (
        <div className="relative pb-12 bg-white">
            {guardianList.map((item) => (
                <Link
                    to={`/guardian/${item.address}`}
                    className="flex items-center justify-between py-5 px-3 cursor-pointer text-base hover:bg-gray-100"
                >
                    <div className="flex items-center gap-2">
                        <Jazzicon
                            diameter={40}
                            seed={jsNumberForAddress(item.address)}
                        />
                        <div>
                            <div>{item.name}</div>
                            <div className="flex flex-col justify-between opacity-50 text-black">
                                {item.address.slice(0, 4)}...
                                {item.address.slice(-4)}
                            </div>
                        </div>
                    </div>

                    <img src={IconChevronRight} />
                </Link>
            ))}

            <Link
                to="/guardian/add"
                className="absolute left-0 right-0 bottom-0 justify-center add-guardian-shadow bg-white py-3 flex gap-2 hover:bg-gray-100"
            >
                <img src={IconAdd} />
                <div>
                    <span className="text-blue font-semibold">
                        Add guardians
                    </span>{" "}
                    to secure
                </div>
            </Link>
        </div>
    );
}
