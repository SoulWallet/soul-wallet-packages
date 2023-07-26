import React from "react";
import { Route } from "react-router-dom";
import { Wallet } from "@src/pages/v1/Wallet";
import Send from "@src/pages/v1/Send";
import SignPage from "@src/pages/v1/SignPage";
import ActivateWallet from "@src/pages/v1/ActivateWallet";
import CreatePage from "@src/pages/v1/Create";
import Setting from "@src/pages/v1/Setting";
import AddFund from "@src/pages/v1/AddFund";
import RecoverPage from "@src/pages/v1/Recover";
import EditGuardians from "@src/pages/v1/EditGuardians";
import ResaveGuardians from "@src/pages/v1/ResaveGuardians";
import Launch from "@src/pages/v1/Launch";

export default (
    <Route path="/v1">
        <Route path="wallet" element={<Wallet />} />
        <Route path="send/:tokenAddress" element={<Send />} />
        <Route path="setting" element={<Setting />} />
        <Route path="add-fund" element={<AddFund />} />
        <Route path="sign" element={<SignPage />} />
        <Route path="activate-wallet" element={<ActivateWallet />} />
        <Route path="launch" element={<Launch />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="recover" element={<RecoverPage />} />
        <Route path="edit-guardians" element={<EditGuardians />} />
        <Route path="resave-guardians" element={<ResaveGuardians />} />
        <Route path="*" element={<Wallet />} />
    </Route>
);
