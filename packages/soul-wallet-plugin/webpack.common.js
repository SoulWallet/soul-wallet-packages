const path = require("path");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        backgroundPage: path.join(__dirname, "src/backgroundPage.ts"),
        contentScripts: path.join(__dirname, "src/contentScripts.ts"),
        inject: path.join(__dirname, "src/inject.ts"),
        popup: path.join(__dirname, "src/popup/index.tsx"),
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
    plugins: [
        new NodePolyfillPlugin()
    ],
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader",
            },
            // Treat src/css/app.css as a global stylesheet
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            // Load .module.css files as CSS modules
            {
                test: /\.module.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "postcss-loader",
                ],
            },
            // add support for fonts and svg
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|gif|png)$/i,
                type: "asset/resource",
            },
        ],
    },
    // Setup @src path resolution for TypeScript files
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@src": path.resolve(__dirname, "src/"),
        },
    },
};
