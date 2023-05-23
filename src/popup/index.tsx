import * as React from "react";
import { createRoot } from 'react-dom/client'
import browser from "webextension-polyfill";
import { Popup } from "./component";
import "../css/app.css";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
    const root = createRoot(document.getElementById('popup')!)
    root.render(<Popup />);
});
