import KeyStore from "@src/lib/keystore";
const keyStore = KeyStore.getInstance();

export default function useKeystore() {
    return keyStore;
}
