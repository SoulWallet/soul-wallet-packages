// import React from "react";

// export default function Fullscreen() {
//     return <div>hello</div>;
// }
import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import "../css/app.css";
import { Fullscreen } from "./fullscreen";

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
    ReactDOM.render(<Fullscreen />, document.getElementById("fullscreen"));
});
