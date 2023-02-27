import React from "react";
export const AUTHORIZED_STORAGE_KEY = "authorized";

const Statement = () => {
    return (
        <div className="flex flex-col items-center gap-4 px-2">
            <div className="text-2xl font-bold text-gray70">Risk Disclosure Statement</div>
            <div className="text-gray70 text-left whitespace-pre-line flex flex-col gap-2 max-h-96 overflow-y-scroll">
                Soul Wallet (&quot;Soulwallet App&quot;, &quot;we&quot; or &quot;us&quot;) is a blockchain-based
                smart-contract wallet service that allows users to store and manage their digital assets. However, like
                all blockchain services, Soul Wallet comes with a certain level of risk. By using Soul Wallet, you
                acknowledge and accept these risks. Please read this Risks Disclosure Statement carefully before using
                Soul Wallet.
                <ul className="flex flex-col gap-y-2 list-decimal pl-8">
                    <li>
                        We released an internal test version, which wants to collect more feedback to improve our
                        product. We want you to know firstly: this version is{" "}
                        <strong>NOT A PRODUCT VERSION FOR REAL</strong> . Please make sure you have the relevant
                        encryption knowledge and asset management skills to <strong>FULL CONTROL this TEST</strong> .
                        Otherwise, otherwise you run the risk of losing all your assets. Thank you for taking our test!
                    </li>
                    <li>
                        Market Risks: Digital assets such as cryptocurrencies can experience significant price
                        fluctuations, which may result in financial losses for users of Soul Wallet. Users should
                        carefully consider the risks involved before investing in digital assets.
                    </li>
                    <li>
                        Operational Risks: Soul Wallet operates in a complex and rapidly evolving technological
                        landscape. As such, it is subject to operational risks such as network outages, hardware and
                        software failures, and cybersecurity threats. Although Soul Wallet implements various security
                        measures to protect users&apos; assets, there is always a risk of a security breach, which could
                        result in the loss of user funds.
                    </li>
                    <li>
                        Technological Risks: Soul Wallet is in its alpha stage, which means that the Soul Wallet and all
                        related software, including blockchain software and smart-contracts, are experimental. Soul
                        Wallet is provided on an “as is” and “as available” basis, without warranty of any kind, either
                        expressed or implied, including, without limitation, warranties that the Soul Wallet or any
                        related software are free of defects, vulnerabilities, merchantable, fit for a particular
                        purpose or non-infringing.
                    </li>
                    <li>
                        Software Weaknesses Risks: Although we make reasonable efforts to ensure that the Soul Wallet
                        and related software follow the high-security standards, we do not warrant or represent that the
                        Soul Wallet or any related software are secure or safe, or protected from fishing, malware or
                        other malicious attacks. Further, the Soul Wallet and related software may contain weaknesses,
                        bugs, vulnerabilities, viruses or other defects which may have a material adverse effect on the
                        operation thereof, or may lead to losses and damages for you, other users of Soul Wallet, or
                        third persons.
                    </li>
                    <li>
                        Regulatory Risks: Digital assets and the services that enable their use are subject to
                        regulatory uncertainty and potential regulatory action. Changes in laws or regulations may have
                        a negative impact on the use of Soul Wallet or the value of digital assets.
                    </li>
                    <li>
                        Usability Risks: The usability of Soul Wallet may be affected by factors such as changes in the
                        user interface, bugs or errors, and changes in the features and functionality of the platform.
                        Users should carefully read the Soul Wallet documentation and stay informed about any changes or
                        updates to the platform.
                    </li>
                    <li>
                        Legal Risks: The use of Soul Wallet may be subject to legal risks, which vary depending on the
                        user&apos;s jurisdiction. Users are responsible for understanding and complying with all
                        applicable laws and regulations.
                    </li>
                </ul>
                By using Soul Wallet, you acknowledge and accept the risks associated with digital asset management and
                agree to hold Soul Wallet harmless from any damages or losses that may result from using the service.
                Soul Wallet does not provide investment advice and is not responsible for any investment decisions made
                by users. Users should carefully consider their financial situation and investment objectives before
                using Soul Wallet.
            </div>
        </div>
    );
};

export default Statement;
