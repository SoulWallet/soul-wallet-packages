import axios from "axios";
import { toast } from "material-react-toastify";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
    // cache error globally
    if (res.data.code !== 200) {
        toast.error(res.data.msg);
    }
    return res.data;
});

const account = {
    add: (params: any) => axio.post("/add-account", params),
    update: (params: any) => axio.post("/update-account", params),
    verifyEmail: (params: any) => axio.post("/verify-email", params),
    recover: (params: any) => axio.post("/add-recovery-record", params),
};



export default {
    account,
};
