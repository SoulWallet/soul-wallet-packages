import browser from "webextension-polyfill";

export default {
    send(type: string, data: any) {
        const { requestId } = data;

        return new Promise(async (resolve, reject) => {
            try {
                await browser.runtime.sendMessage({
                    type: type,
                    data,
                });

                browser.runtime.onMessage.addListener(async (msg) => {
                    console.log("got mesg", msg);
                    if (msg.target === "soul" && msg.data === requestId) {
                        resolve(msg.data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    },
};
