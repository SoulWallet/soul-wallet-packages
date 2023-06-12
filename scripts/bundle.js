const fs = require("fs");
const path = require("path");
const prompt = require("prompt");
const zipdir = require("zip-dir");
const shell = require("shelljs");
shell.set("-e");

const ROOT_PATH = path.resolve(__dirname, "..");

// 读取manifest.json文件
const manifestPath = path.resolve(ROOT_PATH, "__dist_src", "manifest.json");
const manifest = require(manifestPath);

// 获取当前版本号
const currentVersion = manifest.version;

// 配置prompt
prompt.message = "> ";
prompt.delimiter = ": ";

prompt.start();
prompt.get(
    {
        properties: {
            version: {
                description: `当前manifest版本号为(${currentVersion})，如果需要更改请输入，否则默认使用当前值`,
                default: currentVersion,
                pattern: /^\d+\.\d+\.\d+$/,
            },
            useDateTime: {
                description: "是否需要打包时间作为后缀 (y/n)?",
                pattern: /^[yn]$/,
                default: "n",
            },
        },
    },
    (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        const { version, useDateTime } = result;

        if (version !== currentVersion) {
            ["manifest.json", "manifestV2.json"].forEach((mName) => {
                const mPath = path.resolve(ROOT_PATH, "__dist_src", mName);
                const mFile = fs.readFileSync(mPath, "utf-8");
                const obj = JSON.parse(mFile);
                obj.version = version;
                const newData = JSON.stringify(obj, null, 2);
                fs.writeFileSync(mPath, newData, "utf-8");
                console.log(`${mName}文件中的版本号已更新为${version}`);
            });
        } else {
            console.log("版本号未改变，无需更新");
        }

        shell.exec("pnpm build");

        let formattedDate = "";

        if (useDateTime === "y") {
            const date = new Date();
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const hour = ("0" + date.getHours()).slice(-2);
            const minute = ("0" + date.getMinutes()).slice(-2);
            formattedDate = `-${year}${month}${day}_${hour}${minute}`;
        }

        const outputFileName = `SoulWallet-v${version}${formattedDate}`;
        const outputFolder = path.resolve(ROOT_PATH, "dist");
        zipdir(outputFolder, { saveTo: `${outputFileName}.zip` });

        console.log(`构建并打包完成，文件名称为 ${outputFolder}\/${outputFileName}`);
    },
);
