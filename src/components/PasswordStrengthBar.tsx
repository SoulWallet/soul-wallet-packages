import React from "react";

interface IPasswordStrengthBarProps {
    pwd: string;
}

const PasswordStrengthBar = ({ pwd }: IPasswordStrengthBarProps) => {
    return <div>PasswordStrengthBar {pwd}</div>;
};

export default PasswordStrengthBar;
