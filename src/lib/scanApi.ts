import axios from "axios";
import { toast } from "material-react-toastify";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.soulScanURL,
});

axio.interceptors.response.use((res: any) => {
    if (res.data.code !== 200) {
        toast.error(res.data.msg);
    }
    return res.data;
});

const op = {
    list: (walletAddress: string, chainId: number) =>
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
