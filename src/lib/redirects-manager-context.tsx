import * as React from 'react';
import { v4 } from 'uuid';
import { saveState } from './utils';

export interface RedirectsManagerContextInterface {
    store: RedirectionsStore,
    wildcard: boolean,
    saving?: boolean,
    lastSave?: Date,
    lastModification?: Date,
    filterBy?: string,
}

export interface RedirectionProps {
    id: string,
    request?: string,
    destination?: string,
    modificationDate?: any,
    warningRequestDuplication?: boolean,
};

export interface RedirectionsStore extends Array<RedirectionProps> { };

type Action = {type: 'save', value: null} | {type: 'add', value: null} | {type: 'remove', value: RedirectionProps} | {type: 'edit', value: RedirectionProps} | {type: 'set', value: RedirectsManagerContextInterface};
type Dispatch = (action: Action) => void;
type RedirectsManagerProviderProps = {children: React.ReactNode}

const RedirectsManagerContext = React.createContext<RedirectsManagerContextInterface | undefined>(undefined);
const RedirectsManagerDispatchContext = React.createContext<Dispatch | undefined>(undefined);

export

const redirectsManagerReduducer = (state: RedirectsManagerContextInterface, action: Action) => {
    switch (action.type) {

        case 'add': {
            state.store.push({id: v4()});
            return {...state, lastModification: new Date};
        }
        
        case 'edit': {
            const index = state.store.findIndex((el) => {
                return el.id === action.value.id;
            })
            state.store[index] = action.value;
            state.lastModification = new Date;
            return state;
        }

        case 'remove': {
            const newStore = state.store.filter((el) => {
                return el.id !== action.value.id;
            });
            state.store = newStore;
            state.lastModification = new Date;
            return state;
        }

        case 'set': {
            return action.value
        }

        case 'save': {
            break;
        }

        default: {
            throw new Error(`Unhandled action type`)
        }
    }
}

export const RedirectsManagerProvider = ({children}: RedirectsManagerProviderProps) => {
    const [state, dispatch] = React.useReducer(redirectsManagerReduducer, {store: [], wildcard: false} )
    return (
        <RedirectsManagerContext.Provider value={state}>
            <RedirectsManagerDispatchContext.Provider value={dispatch}>
                {children}
            </RedirectsManagerDispatchContext.Provider>
        </RedirectsManagerContext.Provider>
    )
}

export const useRedirectsManagerState = () => {
    const context = React.useContext(RedirectsManagerContext)
    if (context === undefined) {
        throw new Error('useRedirectsManagerState must be used within a RedirectsManagerProvider')
    }
    return context
}

export const useRedirectsManagerDispatch = () => {
    const context = React.useContext(RedirectsManagerDispatchContext)
    if (context === undefined) {
        throw new Error('useRedirectsManagerDispatch must be used within a RedirectsManagerProvider')
    }
    return context
}
