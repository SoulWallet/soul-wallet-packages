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

    private static networkName(netWorkName: string): string {
        //  ' ' -> '-' and lowercase
        return netWorkName.replace(/\s+/g, "-").toLowerCase();
    }

    static Rpc(netWorkName: string): string {
        const envName = `rpc-${Config.networkName(netWorkName)}`;
        const rpc = process.env[envName];
        if (!rpc) {
            throw new Error(`${envName} is not defined in .env.test file`);
        }
        if (!rpc.startsWith("http")) {
            throw new Error(`${envName} is not start with http(s)`);
        }
        return rpc;
    }
    static maxFee(netWorkName: string): number {
        const envName = `maxfee-${Config.networkName(netWorkName)}`;
        const maxFee = process.env[envName];
        if (!maxFee) {
            throw new Error(`${envName} is not defined in .env.test file`);
        }
        const maxFeeNumber = parseFloat(maxFee);
        if (isNaN(maxFeeNumber)) {
            throw new Error(`${envName} is not a number`);
        }
        return maxFeeNumber;
    }

    static getChainList(): string {
        const envName = `CHAINLIST`;
        const chainList = process.env[envName];
        if (!chainList) {
            throw new Error(`${envName} is not defined in .env.test file`);
        }
        return chainList;
    }

    static activateWallet(netWorkName: string): boolean {
        const envName = `activatewallet-${Config.networkName(netWorkName)}`;
        const activate = process.env[envName];
        if (!activate) {
            throw new Error(`${envName} is not defined in .env.test file`);
        }
        return activate === "true";
    }
}
