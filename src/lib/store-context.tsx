import * as React from "react";
import { string } from "prop-types";

import { WerTextfieldProps } from "../components/wer-textfield";

export interface WerRedirectionData {
    id: string,
    request?: string,
    destination?: string,
    modificationDate?: any
};

export interface WerRedirectionsArray extends Array<WerRedirectionData> { };

export interface WerContextInterface {store: WerRedirectionsArray|null, setStore : CallableFunction, getRedirection : CallableFunction, deleteRedirection : CallableFunction };

const StoreContext : React.Context<WerContextInterface> = React.createContext<WerContextInterface>({
    store: null,
    setStore: (props: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => { },
    getRedirection: () => { },
    deleteRedirection: () => { }
})

export const StoreContextProvider = StoreContext.Provider;

export const StoreContextConsumer = StoreContext.Consumer;
