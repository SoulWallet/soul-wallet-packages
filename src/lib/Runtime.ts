import browser from "webextension-polyfill";

export default {
    send(type: string, data: any) {
        const { userOpHash } = data;

        return new Promise(async (resolve, reject) => {
            try {
                await browser.runtime.sendMessage({
                    type: type,
                    data,
                });

                browser.runtime.onMessage.addListener(async (msg) => {
                    console.log("got mesg", msg);
                    if (msg.target === "soul" && msg.data === userOpHash) {
                        resolve(msg.data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    },
};
