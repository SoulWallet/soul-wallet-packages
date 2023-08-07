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
    create: (params: any) => axio.post(`/recovery-record`, params),
    get: (opHash: string) => axio.get(`/recovery-record/${opHash}`),
    getOp: (opHash: string) => axio.get(`/recovery-record/guardian/${opHash}`),
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

const guardian = {
    backup: (params: any) => axio.post("/social-recovery/public-backup-guardians", params),
    emailBackup: (params: any) => axio.post("/social-recovery/email-backup-guardians", params),
    getSlotInfo: (params: any) => axio.get("/social-recovery/slot-info", { params }),
    createRecoverRecord: (params: any) => axio.post("/social-recovery/create-recovery-record", params),
    getRecoverRecord: (params: any) => axio.get("/social-recovery/recovery-record", { params }),
}

const balance = {
    nft: (params: any) => axio.get("/nft-balance", { params }),
    token: (params: any) => axio.get("/token-balance", { params }),
};


export default {
    balance,
    recovery,
    account,
    notification,
    guardian,
};
