import axios from "axios";
import config from "@src/config";
import { UserOperation } from "@soulwallet/sdk";

const axio = axios.create({
    baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
    if (res.data.code !== 200) {
        // TODO, wrap API and useToast
        console.error(res.data.msg);
        // toast.error(res.data.msg);
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
};

const balance = {
    nft: (params: any) => axio.get("/nft-balance", { params }),
    token: (params: any) => axio.get("/user-token-balance", { params }),
};

const sponsor = {
    check: (chainId: string, entryPoint: string, op: UserOperation) =>
        axio.post("/sponsor/sponsor-op", {
            chainId,
            entryPoint,
            op,
        }),
};

export default {
    balance,
    recovery,
    account,
    notification,
    guardian,
    sponsor,
};
