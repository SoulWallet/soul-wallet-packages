import { nanoid } from "nanoid";

export default {
    send(actionType: string, data?: any) {
        const id = nanoid();
        console.log("nano id", id, actionType);
        return new Promise((resolve, reject) => {
            const listener = (msg: any) => {
                if (msg.data.id === id && msg.data.isResponse) {
                    console.log("ready to resolve", msg);
                    resolve(msg.data.data);
                    window.removeEventListener("message", listener);
                }
            };
            try {
                window.postMessage({
                    id,
                    type: actionType,
                    data: {
                        origin: location.origin,
                        ...data,
                    },
                });

                window.addEventListener("message", listener, false);
            } catch (err) {
                reject(err);
            }
        });
    },
    resolve(data: any) {
        console.log("before resolving", data);
        window.postMessage(data);
    },
};
