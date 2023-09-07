import axios from "axios";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.soulScanURL,
});

axio.interceptors.response.use((res: any) => {
    if (res.data.code !== 200) {
           // TODO, wrap API and useToast
           console.error(res.data.msg);
           // toast.error(res.data.msg);
    }
    return res.data;
});

const op = {
    list: (walletAddress: string, chainId: string) =>
        axio.post("/op/search", {
            walletAddress,
            chainId,
        }),
    detail: (opHash: string) =>
        axio.post("/op", {
            opHash,
        }),
};

export default {
    op,
};
