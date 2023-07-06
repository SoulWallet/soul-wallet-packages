import browser from "webextension-polyfill";
import { nanoid } from "nanoid";

export default {
    send(type: string, data?: any) {
        const id = nanoid();

        return new Promise(async (resolve, reject) => {
            try {
                await browser.runtime.sendMessage({
                    id,
                    type,
                    data,
                });

                browser.runtime.onMessage.addListener(async (msg) => {
                    if (msg.id === id) {
                        resolve(msg.data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    },
};
