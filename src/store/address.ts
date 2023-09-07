import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface IAddressItem {
    title: string;
    address: string;
    activatedChains: string[];
    allowedOrigins: string[];
}

export interface IAddressStore {
    selectedAddress: string;
    addressList: IAddressItem[];
    setSelectedAddress: (address: string) => void;
    setAddressList: (addressList: IAddressItem[]) => void;
    addAddressItem: (addressItem: IAddressItem) => void;
    updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => void;
    deleteAddress: (address: string) => void;
    toggleAllowedOrigin: (address: string, origin: string, isAdd?: boolean) => void;
    toggleActivatedChain: (address: string, chainId: string, isAdd?: boolean) => void;
    getIsActivated: (address:string, chainId: string) => boolean;
    getSelectedAddressItem: () => IAddressItem;
}

export const getIndexByAddress = (addressList: IAddressItem[], address: string) => {
    return addressList.findIndex((item: IAddressItem) => item.address === address);
};

const createAddressSlice = immer<IAddressStore>((set, get) => ({
    selectedAddress: "",
    addressList: [],
    getSelectedAddressItem: () => {
        const index = getIndexByAddress(get().addressList, get().selectedAddress);
        return get().addressList[index];
    },
    setSelectedAddress: (address: string) =>
        set({
            selectedAddress: address,
        }),
    setAddressList: (addressList: IAddressItem[]) => {
        set((state) => {
            state.addressList = addressList
        })
    },
    addAddressItem: (addressItem: IAddressItem) => {
        set((state) => {
            state.addressList.push(addressItem);
        });
    },
    updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => {
        set((state) => {
            const index = getIndexByAddress(state.addressList, address);
            const item = state.addressList.filter((item: IAddressItem) => item.address === address)[0];
            const itemToSet = {
                ...item,
                ...addressItem,
            };
            state.addressList[index] = itemToSet;
        });
    },
    getIsActivated: (address, chainId) => {
        const index = getIndexByAddress(get().addressList, address);
        return get().addressList[index].activatedChains.includes(chainId);
    },
    deleteAddress: (address: string) => {
        set((state: IAddressStore) => {
            const index = getIndexByAddress(state.addressList, address);
            state.addressList.splice(index, 1);
        });
    },
    toggleAllowedOrigin: (address, origin, isAdd = true) => {
        set((state: IAddressStore) => {
            const index = getIndexByAddress(state.addressList, address);
            if (isAdd) {
                state.addressList[index].allowedOrigins.push(origin);
            } else {
                state.addressList[index].allowedOrigins.splice(index, 1);
            }
        });
    },
    // IMPORTANT TODO, need to do some onchain check as well
    toggleActivatedChain: (address, chainId, isAdd = true) => {
        set((state: IAddressStore) => {
            const index = getIndexByAddress(state.addressList, address);
            if (isAdd) {
                state.addressList[index].activatedChains.push(chainId);
            } else {
                state.addressList[index].activatedChains.splice(index, 1);
            }
        });
    },
}));

export const useAddressStore = create<IAddressStore>()(
    persist((...set) => ({ ...createAddressSlice(...set) }), {
        name: "address-storage",
    }),
);
