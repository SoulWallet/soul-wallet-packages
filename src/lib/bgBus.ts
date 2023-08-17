import browser from "webextension-polyfill";
import { nanoid } from "nanoid";

export default {
    send(type: string, data?: any) {
        const id = nanoid();

        return new Promise(async (resolve, reject) => {
            const listener = (msg: any) => {
                console.log("listen get:", msg, id);
                if (msg.id === id && msg.isResponse) {
                    resolve(msg.data);
                    browser.runtime.onMessage.removeListener(listener);
                }
            };

            try {
                console.log("nano id", id);
                browser.runtime.sendMessage({
                    id,
                    type,
                    data,
                });

                browser.runtime.onMessage.addListener(listener);
            } catch (err) {
                reject(err);
            }
        });
    },
    resolve(id: string, data: any) {
        browser.runtime.sendMessage({
            id,
            data,
            isResponse: true,
        });
    },
};
