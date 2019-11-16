import * as React from "react";
import { string } from "prop-types";

import { WerTextfieldProps } from "../components/wer-textfield";

export interface WerRedirectionData {
    id: string,
    request?: string,
    destination?: string,
    modificationDate?: any,
    warningRequestDuplication?: boolean,
};

export interface WerRedirectionsArray extends Array<WerRedirectionData> { };

export interface WerContextInterface {
    store: WerRedirectionsArray,
    view:  (orderby?: 'order' | 'request' | 'destination' | 'modificationDate', sort?: 'asc' | 'desc' ) => Array<WerRedirectionData>,
    wildcard: boolean
    setStore : CallableFunction, 
    getRedirection : CallableFunction, 
    deleteRedirection : CallableFunction,
    createRedirection: CallableFunction,
    saveStore: CallableFunction,
    toggleWildcard: (e: React.ChangeEvent<HTMLInputElement>) => void,
    saving: boolean,
    lastSave: {},
    filterBy: string,
    setFilter: (e: React.ChangeEvent<HTMLInputElement>) => void,

};

const StoreContext : React.Context<WerContextInterface> = React.createContext<WerContextInterface>({
    store: [],
    view: () => [],
    wildcard: false,
    setStore: (props: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => { },
    getRedirection: () => { },
    deleteRedirection: () => { },
    createRedirection: () => { },
    saveStore: () => { },
    toggleWildcard: () => { },
    saving: false,
    lastSave: {},
    filterBy: '',
    setFilter: () => { },

})

export const StoreContextProvider = StoreContext.Provider;

export const StoreContextConsumer = StoreContext.Consumer;
