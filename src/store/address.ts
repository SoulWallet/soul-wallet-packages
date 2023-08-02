import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IAddressItem {
    title: string;
    address: string;
    activated: boolean;
}

interface IAddressStore {
    selectedAddress: string;
    addressList: IAddressItem[];
    setSelectedAddress: (address: string) => void;
    addAddressItem: (addressItem: IAddressItem) => void;
    updateAddressItem: (addressItem: IAddressItem) => void;
    deleteAddress: (address: string) => void;
}

const getIndexByAddress = (addressList: IAddressItem[], address: string) => {
    return addressList.findIndex((item: IAddressItem) => item.address === address);
};

const createAddressSlice = immer<IAddressStore>((set) => ({
    selectedAddress: "",
    addressList: [],
    setSelectedAddress: (address: string) => set({ selectedAddress: address }),
    addAddressItem: (addressItem: IAddressItem) => {
        set((state) => {
            state.addressList.push(addressItem);
        });
    },
    updateAddressItem: (addressItem: IAddressItem) => {
        set((state) => {
            const index = getIndexByAddress(state.addressList, addressItem.address);
            state.addressList[index] = addressItem;
        });
    },
    deleteAddress: (address: string) => {
        set((state: IAddressStore) => {
            const index = getIndexByAddress(state.addressList, address);
            state.addressList.splice(index, 1);
        });
    },
}));

export const useAddressStore = create<IAddressStore>()((...set) => ({ ...createAddressSlice(...set) }));
