import { v4 } from 'uuid';
import { saveState, checkRepeatedRequests } from './utils';

export interface RedirectsManagerStateInterface {
    store: RedirectionsStore;
    wildcard: boolean;
    saving?: boolean;
    lastSave?: Date;
    lastModification?: Date;
    filterBy?: string;
    perPage?: number;
    currentPage?: number;
    imported?: boolean;
}

export interface RedirectionProps {
    id: string;
    request?: string;
    destination?: string;
    modificationDate?: any;
    warningRequestDuplication?: boolean;
}

export interface RedirectionsStore extends Array<RedirectionProps> { }

export type Dispatch = (action: Action) => void;

interface UpdateServerStateProps {dispatch: Dispatch; state: RedirectsManagerStateInterface; }

export type UpdateServerStateType = CallableFunction;

export const updateServerState: UpdateServerStateType = async ({dispatch, state}: UpdateServerStateProps) => {
    dispatch({type: 'saving-state', value: true});
    try {
        const newState = await saveState(state);
        dispatch({type: 'set', value: {...newState, lastSave: new Date(), saving: false}});
    } catch (e) {
        dispatch({type: 'saving-state', value: false});
    }
    return;
};

type Action = {type: 'saving-state', value: boolean} |
              {type: 'add', value: null} |
              {type: 'remove', value: RedirectionProps} |
              {type: 'edit', value: RedirectionProps} |
              {type: 'toggle-wildcard', value: boolean} |
              {type: 'set-filter', value: string} |
              {type: 'set-current-page', value: number} |
              {type: 'set', value: RedirectsManagerStateInterface};

type RedirectsManagerReducerType = (
    state: RedirectsManagerStateInterface,
    action: Action) => RedirectsManagerStateInterface;

export const redirectsManagerReducer: RedirectsManagerReducerType = (state, action) => {
    switch (action.type) {

        case 'add': {
            state.store.push({id: v4(), modificationDate: 'not saved'});
            return {...state, currentPage: 1};
        }

        case 'edit': {
            const index = state.store.findIndex((el) => {
                return el.id === action.value.id;
            });
            state.store[index] = action.value;
            state.lastModification = new Date();
            return {...checkRepeatedRequests(state)};
        }

        case 'remove': {
            state.store = state.store.filter((el) => {
                return el.id !== action.value.id;
            });
            state.lastModification = new Date();
            return {...checkRepeatedRequests(state)};
        }

        case 'set': {
            return action.value;
        }

        case 'saving-state': {
            state.saving = action.value;
            return {...state};
        }

        case 'toggle-wildcard': {
            const newState = {...state};
            newState.wildcard = action.value;
            return newState;
        }
        case 'set-filter': {
            const newState = {...state};
            newState.filterBy = action.value;
            return newState;
        }
        case 'set-current-page': {
            const newState = {...state};
            newState.currentPage = action.value;
            return newState;
        }

        default: {
            throw new Error(`Unhandled action type`);
        }
    }
};
