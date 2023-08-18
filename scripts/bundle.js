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
                description: `Current version is: (${currentVersion}), type if you want change`,
                default: currentVersion,
                pattern: /^\d+\.\d+\.\d+$/,
            },
            useDateTime: {
                description: "Add timestamp as postfix (y/n)?",
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
                console.log(`version in ${mName} updated to ${version}`);
            });
        } else {
            console.log("version not changed");
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

        console.log(`Completed, file name: ${outputFolder}\/${outputFileName}`);
    },
);
