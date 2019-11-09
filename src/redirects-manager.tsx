import * as React from "react";
import * as ReactDOM from "react-dom";  

import { Hello } from "./components/Hello";
import { WerTextfield } from "./components/wer-textfield"
import { WerButton } from "./components/wer-button"

ReactDOM.render(
    <WerButton />,
    document.getElementById("redirects_manager")
);