import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useQuery from "@src/hooks/useQuery";
import BN from "bignumber.js";
import { useBalanceStore } from "@src/store/balanceStore";
import { ITokenItem } from "@src/lib/type";
import ListItem from "../ListItem";
import config from "@src/config";
import useBrowser from "@src/hooks/useBrowser";
import { useAddressStore } from "@src/store/address";

export default function Tokens() {
    const { selectedAddress } = useAddressStore()
    const { tokenBalance , fetchTokenBalance} = useBalanceStore();
    const { navigate } = useBrowser();

    useEffect(() => {
        if (!selectedAddress) {
            return;
        }
        fetchTokenBalance(selectedAddress)
    }, [selectedAddress]);

    return (
        <Box color="#1e1e1e" fontSize={"14px"} lineHeight={"1"}>
            {config.assetsList.map((item: ITokenItem, idx: number) => (
                <ListItem
                    key={idx}
                    idx={idx}
                    icon={item.icon}
                    title={item.name}
                    titleDesc={"Token"}
                    amount={`1 ${item.symbol}`}
                    amountDesc={`$1231.21`}
                    onClick={() => navigate(`send/${item.address}`)}
                />
            ))}
        </Box>
    );
}
