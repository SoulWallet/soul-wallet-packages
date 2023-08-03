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
    addressList: IAddressItem[];
    setSelectedAddress: (address: string) => void;
    addAddressItem: (addressItem: IAddressItem) => void;
    updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => void;
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
    updateAddressItem: (address: string, addressItem:Partial<IAddressItem>) => {
        set((state) => {
            const index = getIndexByAddress(state.addressList, address);
            const item = state.addressList.filter((item:IAddressItem) => item.address === address)[0]
            state.addressList[index] = {
                ...item,
                ...addressItem,
            };
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
