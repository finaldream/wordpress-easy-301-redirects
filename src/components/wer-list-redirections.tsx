import * as React from "react";
import { StoreContextConsumer, WerRedirectionData } from "../lib/store-context";

import { WerRedirection } from "./wer-redirection"

export class WerListRedirections extends React.Component {
    public render(): JSX.Element {
        return (
        <StoreContextConsumer>
            { ({view}) => {
                return view().map((redirection)=> {
                    return (
                        <WerRedirection 
                            key={redirection.id}
                            id={redirection.id}
                        />
                    )  
                })
            }
            }
        </StoreContextConsumer>
        )
    }
}