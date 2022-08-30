import React from "react";
import ImgLogo from "@src/assets/logo.svg";
import ImgLogoText from "@src/assets/logo-text.svg";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center mb-12">
            <img className="w-12" src={ImgLogo} />
            <img className="w-24" src={ImgLogoText} />
        </Link>
    );
}
