import * as React from "react";
declare type ContextProps = {
    children: any;
    components: {};
};
export declare const StoreContextProvider: ({ children, ...store }: ContextProps) => JSX.Element;
export declare const StoreContextConsumer: React.Consumer<any>;
export {};
