import { extendTheme, defineStyleConfig } from "@chakra-ui/react";

const tooltipTheme = defineStyleConfig({
    // baseStyle: {
    // },
});

const menuTheme = defineStyleConfig({
    baseStyle: {
        list: {
            borderRadius: "20px",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            overflow: 'hidden'
        },
        divider: {
            my: 1,
            borderColor:"#E6E6E6",
            mx: 3,
        }
    },
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
            black: "#1E1E1E",
        },
    },
    components: {
        Tooltip: tooltipTheme,
        Menu: menuTheme,
        Switch: {
            baseStyle: {
                thumb: {
                    boxShadow:
                        "0px 2.612903118133545px 0.8709677457809448px 0px rgba(0, 0, 0, 0.06), 0px 2.612903118133545px 6.967741966247559px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.8709677457809448px rgba(0, 0, 0, 0.04)",
                },
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
