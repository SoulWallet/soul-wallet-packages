import axios from "axios";
import { toast } from "material-react-toastify";
import config from "@src/config";

const axio = axios.create({
    baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
    if (res.data.code !== 200) {
        toast.error(res.data.msg);
    }
    return res.data;
});

const recovery = {
    get: (params: any) => axio.get(`/recovery-record/${params.opHash}`),
    getOp: (params: any) => axio.get(`/recovery-record/guardian/${params.opHash}`),
    sig: (params: any) => axio.post(`/recovery-record/guardian/${params.opHash}`),
};

const notification = {
    backup: (params: any) => axio.post("/notification/backup-guardians", params),
};

const account = {
    add: (params: any) => axio.post("/add-account", params),
    update: (params: any) => axio.post("/update-account", params),
    verifyEmail: (params: any) => axio.post("/verify-email", params),
    recover: (params: any) => axio.post("/add-recovery-record", params),
    isWalletOwner: (params: any) => axio.post("/is-wallet-owner", params),
    getWalletAddress: (params: any) => axio.post("/get-wallet-address", params),
    finishRecoveryRecord: (params: any) => axio.post("/finish-recovery-record", params),
};

export default {
    recovery,
    // TODO, to be removed
    account,
    notification,
};
