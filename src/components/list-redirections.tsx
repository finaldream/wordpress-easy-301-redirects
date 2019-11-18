import * as React from "react";
import { useRedirectsManagerState } from '../lib/redirects-manager-context';

import { Redirection } from "./redirection"

export const ListRedirections : React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    return (
        <tbody>
        {
        state.store.map((redirection)=> {
            return <Redirection key={redirection.id} redirection={redirection} />
        })
        }
        </tbody>
    
    )
}