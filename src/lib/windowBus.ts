import { nanoid } from "nanoid";

export default {
    send(actionType: string, actionName: string, data?: any) {
        const id = nanoid();
        return new Promise((resolve, reject) => {
            const listener = (msg: any) => {
                if (msg.data.id === id && msg.isResponse) {
                    resolve(msg.data.data);
                    window.removeEventListener("message", listener);
                }
            };
            try {
                window.postMessage({
                    id,
                    type: actionType,
                    action: actionName,
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
    resolve(id: string, data: any) {
        window.postMessage({
            id,
            data,
            isResponse: true,
        });
    },
};
