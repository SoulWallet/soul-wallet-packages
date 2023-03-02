import React from "react";
import Button from "./Button";

const Hints = [
    {
        title: "What is Guardian?",
        content: "Guardians are a list of Ethereum wallet addresses that can help you recover your wallet.",
    },
    {
        title: "Who should I set as guardians?",
        content:
            "You can use your trusted friend's Ethereum address or your current Ethereum wallet address as a guardian.",
    },
    {
        title: "Privacy",
        content:
            "The Guardian addresses you enter will be encrypted. No one will know until they perform the first wallet recovery.",
    },
];

const HintItem = ({ title, content }: { title: string; content: string }) => (
    <div className="flex flex-col">
        <h2 className="font-bold text-lg text-black whitespace-nowrap">{title}</h2>
        <p className="text-sm text-gray-500">{content}</p>
    </div>
);

const GuardianHint = () => {
    return (
        <div className="min-w-fit whitespace-nowrap">
            <h1 className="font-bold text-3xl text-black mb-6">Set up guardians</h1>
            <div className="flex flex-col gap-y-3">
                {Hints.map((hint, index) => (
                    <HintItem key={index} title={hint.title} content={hint.content} />
                ))}
            </div>
        </div>
    );
};

export default GuardianHint;
