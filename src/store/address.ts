import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface IAddressItem {
    title: string;
    address: string;
    activated: boolean;
    allowedOrigins: string[];
}

export interface IAddressStore {
    selectedAddress: string;
    addressList: IAddressItem[];
    setSelectedAddress: (address: string) => void;
    addAddressItem: (addressItem: IAddressItem) => void;
    updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => void;
    deleteAddress: (address: string) => void;
    toggleAllowedOrigin: (address: string, origin: string, isAdd: boolean) => void;
    getSelectedAddressItem: () => IAddressItem;
}

const getIndexByAddress = (addressList: IAddressItem[], address: string) => {
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
            // TODO: check if getSelectedAddressItem is also triggered
            // if it's also selectedItem, update as well
            // if (state.selectedAddress === address) {
            //     state.selectedAddressItem = itemToSet;
            // }
        });
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
}));

export const useAddressStore = create<IAddressStore>()(
    persist((...set) => ({ ...createAddressSlice(...set) }), {
        name: "address-storage",
    }),
);
