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
                gray40: 'rgba(217, 217, 217, .2)',
                green: '#48BE93',
            },
        },
    },
    plugins: [require("daisyui")],
};
