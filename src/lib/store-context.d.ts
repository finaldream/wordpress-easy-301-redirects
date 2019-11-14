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
    store: WerRedirectionsArray | null;
    setStore: CallableFunction;
    getRedirection: CallableFunction;
    deleteRedirection: CallableFunction;
    saving: boolean;
    lastSave: {};
}
export declare const StoreContextProvider: React.Provider<WerContextInterface>;
export declare const StoreContextConsumer: React.Consumer<WerContextInterface>;
