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
        brand: {
            red: "#EC588D",
        },
    },
    components: {
        Tooltip: tooltipTheme,
    },
});

export default theme;
