import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountSettingModal from "../AccountSettingModal";
import { toast } from "material-react-toastify";
import config from "@src/config";
import AddressIcon from "../AddressIcon";
import cn from "classnames";
import { copyText } from "@src/lib/tools";
import Button from "@src/components/Button";
import IconCopy from "@src/assets/copy.svg";
import IconScan from "@src/assets/icons/scan.svg";
import IconTrendUp from "@src/assets/icons/trend-up.svg";
import ImgEthFaded from "@src/assets/chains/eth-faded.svg";
import useBrowser from "@src/hooks/useBrowser";

interface IProps {
    account: string;
    action: string;
}

export default function AccountCard({ account, action }: IProps) {
    const [accountSettingModalVisible, setAccountSettingModalVisible] = useState<boolean>(false);
    const { walletType } = useWalletContext();
    const { navigate } = useBrowser();

    const doCopy = () => {
        copyText(`${config.addressPrefix}${account}`);
        toast.success("Copied");
    };

    return (
        <Flex
            gap="50px"
            flexDir={"column"}
            rounded="24px"
            py="16px"
            px="24px"
            bg="radial-gradient(51.95% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #E2FC89 100%)"
            boxShadow={"0px 4px 8px 0px rgba(0, 0, 0, 0.12)"}
        >
            <Flex align={"center"} justify={"space-between"}>
                <Flex>
                    <Text fontSize={"12px"} fontFamily={"Martian"} fontWeight={"600"} color="#29510A">
                        {account.slice(0, 5)}...{account.slice(-4)}
                    </Text>
                    <Image src={IconCopy} w="20px" />
                </Flex>
                <Image src={IconScan} w="28px" h="28px" />
            </Flex>
            <Flex justify={"space-between"} align="center">
                <Box>
                    <Text color="#29510A" fontSize={"26px"} fontWeight={"800"} mb="6px" lineHeight={"1"}>
                        $1234.56
                    </Text>
                    <Flex gap="1" align="center">
                        <Image src={IconTrendUp} w="12px" h={"12px"} />
                        <Text color="#848488" fontSize="12px" fontWeight={"600"}>
                            $123.45
                        </Text>
                    </Flex>
                </Box>
                <Image src={ImgEthFaded} />
            </Flex>
        </Flex>

        // <div className="flex flex-col items-center justify-between">
        //     <div className="flex items-center justify-between pt-[18px] pb-4 px-6 w-full">
        //         <div>
        //             <div className="text-black font-bold text-lg mb-2 text-left">Account 1</div>
        //             <div
        //                 className="gap-1 flex items-center cursor-pointer tooltip address"
        //                 data-tip="Copy address"
        //                 onClick={doCopy}
        //             >
        //                 <img src={IconCopy} className="w-4" />
        //                 <span className="opacity-50 text-base text-black">
        //                     {config.addressPrefix}
        //                     {account.slice(0, 5)}...{account.slice(-4)}
        //                 </span>
        //             </div>
        //         </div>

        //         <a
        //             className={cn(
        //                 "cursor-pointer border-4 flex",
        //                 accountSettingModalVisible ? "z-[100] rounded-full relative border-blue" : "border-transparent",
        //             )}
        //             onClick={() => setAccountSettingModalVisible((prev) => !prev)}
        //         >
        //             <AddressIcon width={48} address={account} />
        //         </a>
        //     </div>

        // {/* {action === "activate" && walletType === "eoa" && (
        //     <div className="px-6 pb-3 w-full">
        //         <Button type={"primary"} onClick={() => navigate("activate-wallet")} className="w-full">
        //             Activate wallet
        //         </Button>
        //     </div>
        // )}

        // {accountSettingModalVisible && (
        //     <AccountSettingModal onCancel={() => setAccountSettingModalVisible(false)} />
        // )} */}
        // </div>
    );
}
