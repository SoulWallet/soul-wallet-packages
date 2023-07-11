const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    // performance: {
    //     maxEntrypointSize: 250000,
    //     maxAssetSize: 250000,
    // },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        ascii_only: true,
                    },
                    compress: {
                        pure_funcs: ["console.log", "console.warn", "console.debug"],
                    },
                },
            }),
        ],
    },
});
