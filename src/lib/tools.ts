import browser from "webextension-polyfill";
import { nanoid } from "nanoid";
import { ethers } from "ethers";
import { IAddressItem } from "@src/store/address";
import BN from "bignumber.js";
import { chainIdMapping, chainMapping } from "@src/config";
import IconDefault from "@src/assets/tokens/default.svg";

export function notify(title: string, message: string) {
    const randomId = nanoid();
    browser.notifications.create(randomId, {
        type: "basic",
        iconUrl: "../icon-48.png",
        title,
        message,
    });
}

// open browser window especially for background
export function openWindow(url: string, windowWidth: number) {
    browser.windows.create({
        url,
        type: "popup",
        width: 360,
        height: 600 + 28, // 28 is title bar
        top: 0,
        left: windowWidth - 360,
    });
}

export function copyText(value: string) {
    const copied = document.createElement("input");
    copied.setAttribute("value", value);
    document.body.appendChild(copied);
    copied.select();
    document.execCommand("copy");
    document.body.removeChild(copied);
}

/**
 * get local storage
 * @param key
 * @returns
 */
export async function getLocalStorage(key: string): Promise<any> {
    return new Promise((resolve, _) => {
        chrome.storage.local.get(key, function (result) {
            resolve(result[key]);
        });
    });
}

/**
 * set local storage
 * @param key
 * @param value
 * @returns
 */
export async function setLocalStorage(key: string, value: any) {
    return new Promise((resolve, _) => {
        chrome.storage.local.set({ [key]: value }, function () {
            resolve(true);
        });
    });
}

/**
 * remove local storage
 */

export async function removeLocalStorage(key: string) {
    return new Promise((resolve, _) => {
        chrome.storage.local.remove(key, function () {
            resolve(true);
        });
    });
}

/**
 * clear local storage
 */

export async function clearLocalStorage() {
    return new Promise((resolve, _) => {
        chrome.storage.local.clear(function () {
            resolve(true);
        });
    });
}

export const validateEmail = (email?: string) => {
    if (!email) return false;
    const emialRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emialRegex.test(String(email).toLowerCase());
};

export const getMessageType = (msg: string) => {
    if (msg.startsWith("0x") && msg.length === 66) {
        return "hash";
    } else {
        return "text";
    }
};

export const nextRandomId = () => {
    return nanoid();
};

export const formatIPFS = (url: string) => {
    if (url && url.includes("ipfs://")) {
        return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    } else {
        return url;
    }
};

export const addPaymasterAndData = (payToken: string, paymaster: string) => {
    if (payToken === ethers.ZeroAddress) {
        return "0x";
    }

    // TODO, consider decimals
    const paymasterAndData = `${paymaster}${new ethers.AbiCoder()
        .encode(["address", "uint256"], [payToken, ethers.parseEther("1000")])
        .slice(2)}`;

    return paymasterAndData;
};

export const checkAllowed = (origin: string) => {
    const addressStorage = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const selectedAddress = addressStorage.state.selectedAddress;
    const selectedAddressItem = addressStorage.state.addressList.filter(
        (item: IAddressItem) => item.address === selectedAddress,
    )[0];
    const allowedOrigins = selectedAddressItem.allowedOrigins;
    return {
        isAllowed: allowedOrigins.includes(origin),
        selectedAddress,
    };
};

export const checkShouldInject = (origin: string) => {
    const settingStorage = JSON.parse(localStorage.getItem("setting-storage") || "{}");
    const globalShouldInject = settingStorage.state.globalShouldInject;
    const shouldInjectList = settingStorage.state.shouldInjectList;
    const shouldNotInjectList = settingStorage.state.shouldNotInjectList;

    let flag = false;
    if (!origin.startsWith("http")) {
        flag = false;
    } else if (shouldInjectList.includes(origin)) {
        flag = true;
    } else if (shouldNotInjectList.includes(origin)) {
        flag = false;
    } else if (globalShouldInject) {
        flag = true;
    } else if (!globalShouldInject) {
        flag = false;
    }

    return flag;
};

export const getSelectedChainItem = () => {
    const chainStorage = JSON.parse(localStorage.getItem("chain-storage") || "{}");
    const selectedChainId = chainStorage.state.selectedChainId;
    const selectedChainItem = chainStorage.state.chainList.filter(
        (item: any) => item.chainIdHex === selectedChainId,
    )[0];
    return selectedChainItem;
};

// /**
//  * hexlify all members of object, recursively
//  * @param obj
//  */
// export function deepHexlify (obj: any): any {
//     if (typeof obj === 'function') {
//       return undefined
//     }
//     if (obj == null || typeof obj === 'string' || typeof obj === 'boolean') {
//       return obj
//     } else if (obj._isBigNumber != null || typeof obj !== 'object') {
//       return hexlify(obj).replace(/^0x0/, '0x')
//     }
//     if (Array.isArray(obj)) {
//       return obj.map(member => deepHexlify(member))
//     }
//     return Object.keys(obj)
//       .reduce((set, key) => ({
//         ...set,
//         [key]: deepHexlify(obj[key])
//       }), {})
//   }

//   // resolve all property and hexlify.
//   // (UserOpMethodHandler receives data from the network, so we need to pack our generated values)
//   export async function resolveHexlify (a: any): Promise<any> {
//     return deepHexlify(await resolveProperties(a))
//   }

const to10 = (n: any) => {
    return BN(n).toString();
};

export const printUserOp = (userOp: any) => {
    console.log(
        JSON.stringify([
            {
                sender: userOp.sender,
                nonce: userOp.nonce.toString(),
                initCode: userOp.initCode,
                callData: userOp.callData,
                callGasLimit: to10(userOp.callGasLimit),
                verificationGasLimit: to10(userOp.verificationGasLimit),
                preVerificationGas: to10(userOp.preVerificationGas),
                maxFeePerGas: to10(userOp.maxFeePerGas),
                maxPriorityFeePerGas: to10(userOp.maxPriorityFeePerGas),
                paymasterAndData: userOp.paymasterAndData,
                signature: userOp.signature,
            },
        ]),
    );
};

export const hasCommonElement = (arr1: [], arr2: []) => {
    return arr1.some((item) => arr2.includes(item));
};

export const toShortAddress = (address: string, firstSlice: number = 6, lastSlice: number = 4) => {
    if (address.length > 10) {
        return `${address.slice(0, firstSlice)}...${address.slice(-lastSlice)}`;
    }

    return address;
};

export const numToFixed = (num: any, precision: number) => {
    const bn = BN(num);
    let str = bn.toFixed(precision);
    if (str.indexOf(".") > 0) {
        str = str.replace(/0+$/, "");
        if (str[str.length - 1] === ".") {
            str = str.substring(0, str.length - 1);
        }
    }
    return str;
};

export const getNetwork = (chainId: number) => {
    const name = chainIdMapping[chainId as keyof typeof chainIdMapping] || "";
    console.log("getNetwork", chainId, name);
    return name;
};

export const getChainInfo = (chainId: string) => {
    return chainMapping[chainId as keyof typeof chainMapping] || { icon: IconDefault, name: `Chain ID: ${Number(chainId)}` };
};

export const getStatus = (statusId: number) => {
    if (statusId === 1) {
        return "Recovered";
    } else if (statusId === 0) {
        return "Pending";
    }

    return "Pending";
};

export const getKeystoreStatus = (statusId: number) => {
    if (statusId === 3) {
        return "Recovered";
    }

    return "Pending";
};

// on new device, user need to retrive their address store
// export const initAddressStatus = async(addressList: string[], chainList: any) => {

//     return [
//         {
//             address: addressList[0],
//             activatedChains: [],
//         }
//     ]
// }