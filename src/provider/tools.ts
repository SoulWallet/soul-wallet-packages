export const getMessageType = (msg: string) => {
    if (msg.startsWith("0x") && msg.length === 66) {
        return "hash";
    } else {
        return "text";
    }
};
