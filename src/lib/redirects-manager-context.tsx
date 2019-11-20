import * as React from 'react';
import { v4 } from 'uuid';
import { saveState, checkRepeatedRequests } from './utils';

export interface RedirectsManagerContextInterface {
    store: RedirectionsStore,
    wildcard: boolean,
    saving?: boolean,
    lastSave?: Date,
    lastModification?: Date,
    filterBy?: string,
    perPage?: number,
    currentPage?: number,
    imported?: boolean,
}

export interface RedirectionProps {
    id: string,
    request?: string,
    destination?: string,
    modificationDate?: any,
    warningRequestDuplication?: boolean,
};

export interface RedirectionsStore extends Array<RedirectionProps> { };

type Dispatch = (action: Action) => void;
type RedirectsManagerProviderProps = {children: React.ReactNode}

const RedirectsManagerContext = React.createContext<RedirectsManagerContextInterface | undefined>(undefined);
const RedirectsManagerDispatchContext = React.createContext<Dispatch | undefined>(undefined);

type updateServerStateProps = {dispatch : Dispatch, state: RedirectsManagerContextInterface};

export const updateServerState = async ({dispatch, state} : updateServerStateProps) => {
    dispatch({type: 'saving-state', value: true})
    try {
        const newState = await saveState(state);
        dispatch({type: 'set', value: {...newState, lastSave: new Date, saving: false}})
    } catch (e) {
        dispatch({type: 'saving-state', value: false})
    }
}

type Action = {type: 'saving-state', value: boolean} | 
              {type: 'add', value: null} | 
              {type: 'remove', value: RedirectionProps} | 
              {type: 'edit', value: RedirectionProps} | 
              {type: 'set', value: RedirectsManagerContextInterface};

const redirectsManagerReduducer = (state: RedirectsManagerContextInterface, action: Action) => {
    switch (action.type) {

        case 'add': {
            state.store.push({id: v4(), modificationDate: 'not saved'});
            return {...state, currentPage: 1};
        }
        
        case 'edit': {
            const index = state.store.findIndex((el) => {
                return el.id === action.value.id;
            })
            state.store[index] = action.value;
            state.lastModification = new Date;
            return {...checkRepeatedRequests(state)};
        }

        case 'remove': {
            state.store = state.store.filter((el) => {
                return el.id !== action.value.id;
            });
            state.lastModification = new Date;
            return {...checkRepeatedRequests(state)};
        }

        case 'set': {
            return action.value
        }

        case 'saving-state': {
            state.saving = action.value
            return state;
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
