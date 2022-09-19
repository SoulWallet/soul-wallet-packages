import axios from "axios";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
    console.log("res", res);
    // cache error globally
    if (res.code !== 200) {
        console.log("error", res);
    }
    return res;
});

const account = {
    add: (params: any) => axio.post("/add-account", params),
    update: (params: any) => axio.post("/update-account", params),
    verifyEmail: (params: any) => axio.post("/verify-email", params),
};

export default {
    account,
};
