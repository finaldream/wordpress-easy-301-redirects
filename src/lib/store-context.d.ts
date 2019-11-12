import * as React from "react";
export interface WerRedirectionData {
    id: string;
    request?: string;
    destination?: string;
    modificationDate?: any;
}
export interface WerRedirectionsArray extends Array<WerRedirectionData> {
}
export interface WerContextInterface {
    store: WerRedirectionsArray | null;
    setStore: CallableFunction;
    getRedirection: CallableFunction;
    deleteRedirection: CallableFunction;
}
export declare const StoreContextProvider: React.Provider<WerContextInterface>;
export declare const StoreContextConsumer: React.Consumer<WerContextInterface>;
