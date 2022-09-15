// @ts-nocheck
// inject global variable to user page
window.soul = {
    isSoul: true,
    sign: () => {
        window.postMessage({
            target: "soul",
            type: "sign",
            data: {},
        });
    },
};
