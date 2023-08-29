import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export class Config {
    static privateKey(): string {
        const _privateKey = process.env.PRIVATEKEY;
        if (!_privateKey) {
            throw new Error("PRIVATEKEY is not defined in .env.test file");
        }
        const regex = /^0x[a-fA-F0-9]{64}$/;
        if (!regex.test(_privateKey)) {
            throw new Error("PRIVATEKEY is not valid: " + _privateKey);
        }
        return _privateKey;
    }
    static Rpc(netWorkName: string): string {
        //  ' ' -> '-' and lowercase
        netWorkName = netWorkName.replace(/\s+/g, "-").toLowerCase();
        const envName = `rpc-${netWorkName}`;
        const rpc = process.env[envName];
        if (!rpc) {
            throw new Error(`${envName} is not defined in .env.test file`);
        }
        if (!rpc.startsWith("http")) {
            throw new Error(`${envName} is not start with http(s)`);
        }
        return rpc;
    }
}
