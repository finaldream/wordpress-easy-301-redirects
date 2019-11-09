import * as React from "react";

type ContextProps = {
    children: any,
    components: {},
}

const StoreContext : React.Context<any> = React.createContext({})

export const StoreContextProvider = ({ children, ...store }: ContextProps) => (
    <StoreContext.Provider value={{ ...store  }}>
        {children}
    </StoreContext.Provider>
);

export const StoreContextConsumer = StoreContext.Consumer;