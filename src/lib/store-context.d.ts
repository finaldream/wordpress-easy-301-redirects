import * as React from "react";
export interface WerRedirectionData {
    id: string | number;
    request: string;
    destination: string;
    modificationDate?: any;
}
export interface WerContextInterface extends Array<WerRedirectionData> {
}
export declare const StoreContextProvider: React.Provider<WerContextInterface>;
export declare const StoreContextConsumer: React.Consumer<WerContextInterface>;
