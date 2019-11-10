import * as React from "react";
import { StoreContextConsumer } from "../lib/store-context";

import { WerRedirection } from "./wer-redirection"

export class WerListRedirections extends React.Component {
    public render(): JSX.Element {
        return (
        <StoreContextConsumer>
            { (store) => {
                    const listRedirections = store.map(redirection =>
                        <WerRedirection 
                            key={redirection.id}
                            id={redirection.id}
                        />
                    );
                    return (
                        listRedirections
                    )
                } 
            }
        </StoreContextConsumer>
        )
    }
}