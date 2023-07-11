const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map",
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 200,
        poll: 1000, // 每秒轮询检查一次变化
    },
});
