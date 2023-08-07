import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface IAddressItem {
    title: string;
    address: string;
    activated: boolean;
}

interface IAddressStore {
    selectedAddress: string;
    selectedAddressItem: IAddressItem;
    addressList: IAddressItem[];
    setSelectedAddress: (address: string) => void;
    addAddressItem: (addressItem: IAddressItem) => void;
    updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => void;
    deleteAddress: (address: string) => void;
}

const getIndexByAddress = (addressList: IAddressItem[], address: string) => {
    return addressList.findIndex((item: IAddressItem) => item.address === address);
};

const createAddressSlice = immer<IAddressStore>((set, get) => ({
    selectedAddress: "",
    selectedAddressItem: {
        title: "",
        address: "",
        activated: false,
    },
    addressList: [],
    setSelectedAddress: (address: string) =>
        set({
            selectedAddress: address,
            selectedAddressItem: get().addressList.filter((item: IAddressItem) => item.address === address)[0],
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
            // if it's also selectedItem, update as well
            if(state.selectedAddress === address) {
                state.selectedAddressItem = itemToSet;
            }
        });
    },
    deleteAddress: (address: string) => {
        set((state: IAddressStore) => {
            const index = getIndexByAddress(state.addressList, address);
            state.addressList.splice(index, 1);
        });
    },
}));

export const useAddressStore = create<IAddressStore>()(
    persist((...set) => ({ ...createAddressSlice(...set) }), {
        name: "address-storage",
    }),
);
