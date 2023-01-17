export default {
    send(actionType: string, actionName: string, data?: any) {
        return new Promise((resolve, reject) => {
            try {
                window.postMessage({
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
};
