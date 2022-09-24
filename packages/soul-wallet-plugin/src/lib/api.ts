import axios from "axios";
import { toast } from "material-react-toastify";
import { getLocalStorage } from "./tools";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.backendURL,
});

axio.interceptors.request.use(async (config: any) => {
    config.headers.authorization = `bearer ${await getLocalStorage("authorization")}`;
    return config;
});

axio.interceptors.response.use((res: any) => {
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

const guardian = {
    get: (params: any) => axio.post("/get-account-guardian", params),
    add: (params: any) => axio.post("/add-account-guardian", params),
    remove: (params: any) => axio.post("/del-account-guardian", params),
};

export default {
    account,
    guardian,
};
