import React from "react";
import {
  Box,
  Text,
  Image,
  Button,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
export const AUTHORIZED_STORAGE_KEY = "authorized";

const Statement = () => {
  return (
    <Box h="400px" overflowY={"auto"}>
      <Box>
        <Text marginBottom="20px">Soul Wallet (&quot;Soulwallet App&quot;, &quot;we&quot; or &quot;us&quot;) is a blockchain-based smart-contract wallet service that allows users to store and manage their digital assets. However, like all blockchain services, Soul Wallet comes with a certain level of risk. By using Soul Wallet, you acknowledge and accept these risks. Please read this Risks Disclosure Statement carefully before using Soul Wallet.</Text>
        <OrderedList>
          <ListItem>
            <Text marginBottom="14px">
              We have released an internal test version of alpha to gather more feedback to improve our
              product. First of all, we want you to know that this release is{" "}
              <strong>NOT A NATURAL VERSION OF THE PRODUCT</strong>. Second, please ensure you have the
              relevant encryption knowledge and asset management <strong>SKILLS TO FULLY CONTROL</strong> this
              test. Even so, you may still <strong>RUN THE RISK OF LOSING ALL YOUR ASSETS</strong>. Please{" "}
              <strong>DO NOT TRANSFER TOO MANY ASSETS</strong> for the sake of testing, and thank you for
              participating in our test!
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Market Risks: Digital assets such as cryptocurrencies can experience significant price
              fluctuations, which may result in financial losses for users of Soul Wallet. Users should
              carefully consider the risks involved before investing in digital assets.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Operational Risks: Soul Wallet operates in a complex and rapidly evolving technological
              landscape. As such, it is subject to operational risks such as network outages, hardware and
              software failures, and cybersecurity threats. Although Soul Wallet implements various security
              measures to protect users&apos; assets, there is always a risk of a security breach, which could
              result in the loss of user funds.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Technological Risks: Soul Wallet is in its alpha stage, which means that the Soul Wallet and
              all related software, including blockchain software and smart-contracts, are experimental. Soul
              Wallet is provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranty
              of any kind, either expressed or implied, including, without limitation, warranties that the
              Soul Wallet or any related software are free of defects, vulnerabilities, merchantable, fit for
              a particular purpose or non-infringing.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Software Weaknesses Risks: Although we make reasonable efforts to ensure that the Soul Wallet
              and related software follow the high-security standards, we do not warrant or represent that the
              Soul Wallet or any related software are secure or safe, or protected from fishing, malware or
              other malicious attacks. Further, the Soul Wallet and related software may contain weaknesses,
              bugs, vulnerabilities, viruses or other defects which may have a material adverse effect on the
              operation thereof, or may lead to losses and damages for you, other users of Soul Wallet, or
              third persons.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Regulatory Risks: Digital assets and the services that enable their use are subject to
              regulatory uncertainty and potential regulatory action. Changes in laws or regulations may have
              a negative impact on the use of Soul Wallet or the value of digital assets.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Usability Risks: The usability of Soul Wallet may be affected by factors such as changes in the
              user interface, bugs or errors, and changes in the features and functionality of the platform.
              Users should carefully read the Soul Wallet documentation and stay informed about any changes or
              updates to the platform.
            </Text>
          </ListItem>
          <ListItem>
            <Text marginBottom="14px">
              Legal Risks: The use of Soul Wallet may be subject to legal risks, which vary depending on the
              user&apos;s jurisdiction. Users are responsible for understanding and complying with all
              applicable laws and regulations.
            </Text>
          </ListItem>
        </OrderedList>
        <Text marginTop="20px" marginBottom="20px">
          By using Soul Wallet, you acknowledge and accept the risks associated with digital asset management and
          agree to hold Soul Wallet harmless from any damages or losses that may result from using the service.
          Soul Wallet does not provide investment advice and is not responsible for any investment decisions made
          by users. Users should carefully consider their financial situation and investment objectives before
          using Soul Wallet.
        </Text>
      </Box>
    </Box>
  );
};

export default Statement;
