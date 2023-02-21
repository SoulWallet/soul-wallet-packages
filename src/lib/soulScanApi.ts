import axios from "axios";
import { toast } from "material-react-toastify";
import { getLocalStorage } from "./tools";
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
    get: (params: any) => axio.get(`/op/${params.opHash}`),
    getAll: (params: any) => axio.post("/op/search", params),
};

export default {
    op,
};
