import { extendTheme, defineStyleConfig } from "@chakra-ui/react";

const baseTooltipStyle = {
    color: "#000",
    bg: "#fff",
    borderWidth: "5px",
    borderColor: "#000",
    boxShadow: "6px 6px 0px #000000",
    p: "6px",
};

const tooltipTheme = defineStyleConfig({
    baseStyle: baseTooltipStyle,
});

const theme = extendTheme({
    fonts: {
        body: `'Nunito', sans-serif`,
    },
    colors: {
        appBg: "#F7F7F7",
        danger: "#E83D26",
        brand: {
            red: "#EC588D",
        },
    },
    components: {
        Tooltip: tooltipTheme,
        Switch: {
            baseStyle: {
                thumb:{
                    boxShadow: "0px 2.612903118133545px 0.8709677457809448px 0px rgba(0, 0, 0, 0.06), 0px 2.612903118133545px 6.967741966247559px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.8709677457809448px rgba(0, 0, 0, 0.04)",
                }
            },
            sizes: {
                lg: {
                    track: {
                        w: "44px",
                        h: "28px",
                    },
                    thumb: {
                        w: "24px",
                        h: "24px",
                        transform: "translateY(2px) translateX(2px)",
                    },
                },
            },
        },
    },
});

export default theme;
