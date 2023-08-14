import { nanoid } from "nanoid";

export default {
    send(actionType: string, actionName: string, data?: any) {
        const id = nanoid();
        return new Promise((resolve, reject) => {
            try {
                window.postMessage({
                    id,
                    target: "soul",
                    type: actionType,
                    action: actionName,
                    data: {
                        origin: location.origin,
                        ...data,
                    },
                });

                window.addEventListener(
                    "message",
                    (msg) => {
                        // TODO, refactor this
                        if (
                            msg.data.target === "soul" &&
                            msg.data.type === "response" &&
                            msg.data.action === actionName
                        ) {
                            resolve(msg.data.data);
                        }
                    },
                    false,
                );
            } catch (err) {
                reject(err);
            }
        });
    },
    resolve(id: string, data: any) {
        window.postMessage({
            id,
            data,
        });
    },
};
