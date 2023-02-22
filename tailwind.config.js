const gen =
    (valueProcessor = (v) => v, keyProcessor = (v) => v) =>
    (l) =>
        l
            .map((i) => [keyProcessor(i), valueProcessor(i)])
            .reduce((acc, [i, v]) => {
                acc[i] = v;
                return acc;
            }, {});
const PERCENT_SIZE = [...Array(101).keys()];
const WIDTH_PERCENTAGE_STYLES = PERCENT_SIZE.map((i) => `w-${i}p`);

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/popup.html"],
    content: [
        "./src/components/**/*.{html,js,tsx}",
        "./src/popup/**/*.{html,js,tsx}",
        "./src/pages/**/*.{html,js,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                redLight: "#EB5858",
                warnRed: "#FE7575",
                alarmRed: "#FF4343",
                blue: "#3840FF",
                redLight: "#FE7575",
                blue: "#7184FA",
                blueDeep: "#514DF5",
                gray10: "rgba(0,0,0,.1)",
                gray20: "#fafafa",
                gray30: "#d9d9d9",
                gray40: "rgba(217, 217, 217, .2)",
                green: "#48BE93",
                purple: "#7184FA",
                gray70: "rgba(0,0,0,0.7)",
                lightWhite: "#FAFAFA",
                lightGray: "#E0E0E0",
            },
            width: () => ({
                sm: "124px",
                base: "428px",
                lg: "468px",
                ...gen(
                    (v) => `${v}%`,
                    (k) => `${k}p`,
                )(PERCENT_SIZE),
            }),
            backgroundImage: {
                "web-bg": "url('/src/assets/bg.svg')",
                gray60: "#999999",
                gray60: "#737373",
                gray80: "#4d4d4d",
                green: "#48BE93",
            },
        },
    },
    safelist: [...WIDTH_PERCENTAGE_STYLES],
    plugins: [require("daisyui")],
};
