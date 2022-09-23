import { useContext } from "react";
import { WalletContext } from "../WalletContext";

export default function useWalletContext() {
    return useContext(WalletContext);
}
