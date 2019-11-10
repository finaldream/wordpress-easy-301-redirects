import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { StoreContextProvider } from "./lib/store-context";

import { WerListRedirections } from "./components/wer-list-redirections"
import { WerRedirection } from "./components/wer-redirection"

const state = [
    {
        id: 1,
        request: "http://www.google.com",
        destination: "http://test.org"
    },    
    {
        id: 2,
        request: "http://www.another.com",
        destination: "http://justme.org"
    }
];

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
                <StoreContextProvider value={state}>
                    <WerListRedirections />
                    <WerRedirection id="0" />
                </StoreContextProvider>
            </tbody>
        </table>
        )
    }
}

ReactDOM.render(
    <WerTable />,
    document.getElementById("redirects_manager")
);