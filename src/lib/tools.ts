import browser from "webextension-polyfill";
import { v4 as uuidv4 } from 'uuid'

export function notify(title: string, message: string) {
    const notifyId = Math.ceil(Math.random() * 1000).toString();

    browser.notifications.create(notifyId, {
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

export function* uuidGenerator() {
  while (true) {
    yield uuidv4()
  }
}

export const nextRandomId = () => {
  return uuidGenerator().next().value
}
