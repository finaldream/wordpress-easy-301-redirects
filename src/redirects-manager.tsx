import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

import { WerRedirection } from "./components/wer-redirection"

export class WerTable extends React.Component {
    public render(): JSX.Element {
        return (
        <table className="widefat">
            <thead>
                <tr>
                    <th colSpan={2} >Request</th>
                    <th>Destination</th>
                    <th>Last Modification</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <WerRedirection id="0" />
            </tbody>
        </table>
        )
    }
}

ReactDOM.render(
    <WerTable />,
    document.getElementById("redirects_manager")
);