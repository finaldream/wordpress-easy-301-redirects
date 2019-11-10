import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

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

const listRedirections = state.map(redirection => 
    <WerRedirection 
        id={redirection.id.toString()}
        destination={redirection.destination}
        request={redirection.request}
    />
);

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
                {listRedirections}
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