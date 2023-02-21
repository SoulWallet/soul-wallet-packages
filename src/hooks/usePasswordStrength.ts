import { zxcvbnOptions, zxcvbnAsync } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { useEffect, useState } from "react";

const options = {
    // recommended
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
    // recommended
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    // recommended
    useLevenshteinDistance: true,
    // optional
    translations: zxcvbnEnPackage.translations,
};
zxcvbnOptions.setOptions(options);

// ? zxvcbn is quite slow, maybe change to a easy regex
export const usePasswordStrength = (password: string) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (password.length > 8) {
            zxcvbnAsync(password).then((response) => setScore(response?.score));
        }
    }, [password]);

    return score;
};
