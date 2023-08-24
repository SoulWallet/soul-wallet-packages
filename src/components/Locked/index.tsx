import React, { useState, useImperativeHandle, forwardRef, useRef } from "react";
import { Image, Flex, Box, Text, useToast } from "@chakra-ui/react";
import FormInput from "../FormInput";
import IconLogo from "@src/assets/logo-v3.svg";
import IconLogoText from "@src/assets/logo-text.svg";
import KeyStore from "@src/lib/keystore";
import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
const keyStore = KeyStore.getInstance();

export default forwardRef<any>((props, ref) => {
    const { goWebsite } = useBrowser();
    const toast = useToast();
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [password, setPassword] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [passwordError, setPasswordError] = useState<string>("");
    const [unlocking, setUnlocking] = useState<boolean>(false);

    const inputRef: any = useRef(null);

    useImperativeHandle(ref, () => ({
        async show() {
            inputRef.current.focus();

            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
                setVisible(true);
            });
        },
    }));

    const doUnlock = async () => {
        try {
            if (!password) {
                toast({
                    title: "Please enter password",
                    status: "error",
                });
                return;
            }
            setUnlocking(true);
            await keyStore.unlock(password);
            setVisible(false);
            setPassword("");
        } catch (err) {
            toast({
                title: "Wrong password",
                status: "error",
            });
        } finally {
            setUnlocking(false);
        }
    };

    return (
        <Box
            bg="appBg"
            bgSize={"100% 100%"}
            flexDir={"column"}
            display={visible ? "flex" : "none"}
            position={"absolute"}
            alignItems={"center"}
            h="100%"
            bottom={"0"}
            left="0"
            top="0"
            right={"0"}
            overflow={"hidden"}
            zIndex={100}
            px="6"
            pt="90px"
            ref={ref}
            {...props}
        >
            <Flex flexDir={"column"} align={"center"} gap="3" mb="8">
                <Image src={IconLogo} w="75px" />
                <Image src={IconLogoText} w="90px" />
            </Flex>

            <FormInput
                ref={inputRef}
                isPassword={true}
                value={password}
                mb="3"
                placeholder="Password"
                type="password"
                autoFocus={true}
                onEnter={doUnlock}
                w="100%"
                onChange={(val: any) => {
                    setPassword(val);
                    setPasswordError("");
                }}
                error={passwordError}
            />
            <Button
                onClick={doUnlock}
                loading={unlocking}
                fontSize="20px"
                fontWeight={"800"}
                bg="#1e1e1e"
                py="4"
                w="100%"
            >
                Continue
            </Button>

            <Text
                onClick={() => goWebsite("recover")}
                position={"absolute"}
                bottom="8"
                fontSize={"16px"}
                fontWeight={"800"}
                cursor={"pointer"}
            >
                Forgot password?
            </Text>
        </Box>
    );
});
