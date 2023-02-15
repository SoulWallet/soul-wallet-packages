module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/popup.html"],
    content: ["./src/**/*.{html,js,tsx}"],
    theme: {
        extend: {
            colors: {
                redLight: "#FE7575",
                blue: "#7184FA",
                blueDeep: "#514DF5",
                gray10: "rgba(0,0,0,.1)",
                gray20: "#fafafa",
                gray30: "#d9d9d9",
                gray40: "rgba(217, 217, 217, .2)",
                gray60: "#999999",
                gray60: "#737373",
                gray80: "#4d4d4d",
                green: "#48BE93",
            },
        },
    },
    plugins: [require("daisyui")],
};
