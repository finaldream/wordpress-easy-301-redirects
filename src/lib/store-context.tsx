import * as React from "react";
import { string } from "prop-types";

export interface WerRedirectionData {
    id: string | number,
    request: string,
    destination: string,
    modificationDate?: any
};

export interface WerContextInterface extends Array<WerRedirectionData> { }

const StoreContext : React.Context<WerContextInterface> = React.createContext<WerContextInterface | null>(null)

export const StoreContextProvider = StoreContext.Provider;

export const StoreContextConsumer = StoreContext.Consumer;