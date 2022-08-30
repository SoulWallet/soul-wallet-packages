module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/popup.html"],
    content: ["./src/**/*.{html,js,tsx}"],
    theme: {
        extend: {
            colors: {
                redLight: "#EB5858",
                blue: "#3840FF",
                blueDeep: "#514DF5",
                gray10: "rgba(0,0,0,.1)",
                gray30: "#d9d9d9",
            },
        },
    },
    plugins: [require("daisyui")],
};
