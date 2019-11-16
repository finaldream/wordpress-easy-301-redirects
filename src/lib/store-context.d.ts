import * as React from "react";
export interface WerRedirectionData {
    id: string;
    request?: string;
    destination?: string;
    modificationDate?: any;
    warningRequestDuplication?: boolean;
}
export interface WerRedirectionsArray extends Array<WerRedirectionData> {
}
export interface WerContextInterface {
    store: WerRedirectionsArray;
    view: (orderby?: 'order' | 'request' | 'destination' | 'modificationDate', sort?: 'asc' | 'desc') => Array<WerRedirectionData>;
    wildcard: boolean;
    setStore: CallableFunction;
    getRedirection: CallableFunction;
    deleteRedirection: CallableFunction;
    createRedirection: CallableFunction;
    saveStore: CallableFunction;
    toggleWildcard: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saving: boolean;
    lastSave: {};
    filterBy: string;
    setFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare const StoreContextProvider: React.Provider<WerContextInterface>;
export declare const StoreContextConsumer: React.Consumer<WerContextInterface>;
