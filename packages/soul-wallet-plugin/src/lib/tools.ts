export function copyText(value: string) {
    const copied = document.createElement("input");
    copied.setAttribute("value", value);
    document.body.appendChild(copied);
    copied.select();
    document.execCommand("copy");
    document.body.removeChild(copied);
    // message.success('Copied')
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

/**
 * get session storage
 * @param key
 * @returns
 */
export async function getSessionStorage(key: string): Promise<string> {
    // @ts-ignore
    return (await chrome.storage.session.get(key))[key];
}

/**
 * set session storage
 * @param key
 * @param value
 * @returns
 */
export async function setSessionStorage(
    key: string,
    value: any,
): Promise<void> {
    // @ts-ignore
    return await chrome.storage.session.set({ [key]: value });
}

/**
 * remove session storage
 */

export async function removeSessionStorage(key: string): Promise<void> {
    // @ts-ignore
    return await chrome.storage.session.remove(key);
}

export async function getGuardianName(address: string): Promise<void> {
    let guardianNameMapping =
        (await getLocalStorage("guardianNameMapping")) || {};

    return guardianNameMapping[address];
}

export async function setGuardianName(
    address: string,
    name: string,
): Promise<void> {
    let guardianNameMapping =
        (await getLocalStorage("guardianNameMapping")) || {};
    guardianNameMapping[address] = name;
    await setLocalStorage("guardianNameMapping", guardianNameMapping);
}
