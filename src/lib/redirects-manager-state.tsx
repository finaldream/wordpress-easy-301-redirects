import { v4 } from 'uuid';
import { saveState, checkRepeatedRequests } from './utils';

export interface RedirectsManagerStateInterface {
    redirects: RedirectionProps[];
    saving?: boolean;
    lastSave?: Date;
    lastModification?: Date;
    filterBy?: string;
    orderBy?: string;
    perPage?: number;
    currentPage?: number;
    imported?: boolean;
}

export interface RedirectionProps {
    id: string;
    request?: string;
    destination?: string;
    modificationDate?: Date | string;
    warningRequestDuplication?: boolean;
    viewPosition?: number;
}

export type Dispatch = (action: Action) => void;

interface UpdateServerStateProps {dispatch: Dispatch; state: RedirectsManagerStateInterface; }

type Action = {type: 'add', value: null} |
              {type: 'remove', value: RedirectionProps} |
              {type: 'edit', value: RedirectionProps} |
              {type: 'set', value: Partial<RedirectsManagerStateInterface>};

type RedirectsManagerReducerType = (
    state: RedirectsManagerStateInterface,
    action: Action) => RedirectsManagerStateInterface;

export const updateServerState = async ({dispatch, state}: UpdateServerStateProps) => {
    dispatch({type: 'set', value: {saving: true}});
    try {
        const newState = await saveState(state);
        dispatch({type: 'set', value: {...newState, lastSave: new Date(), saving: false}});
    } catch (e) {
        dispatch({type: 'set', value: {saving: false}});
    }
    return;
};

export const redirectsManagerReducer: RedirectsManagerReducerType = (state, action) => {
    switch (action.type) {

        case 'add': {
            const newState = {...state};
            const newRedirect = {id: v4(), modificationDate: null, request: '', destination: ''};
            console.log('newRedirect', newRedirect);
            newState.redirects.reverse()
            newState.redirects.push(newRedirect);
            newState.redirects.reverse()
            newState.currentPage = 1;
            newState.orderBy = '-modificationDate';
            return newState;
        }

        case 'edit': {
            const newState = {...state};
            const index = newState.redirects.findIndex((el) => {
                return el.id === action.value.id;
            });
            if (index !== -1) {
                newState.redirects[index] = action.value;
            }
            newState.lastModification = new Date();
            const validatedState = checkRepeatedRequests(newState);
            return validatedState;
        }

        case 'remove': {
            const newState = {...state};
            newState.redirects = newState.redirects.filter((el) => {
                return el.id !== action.value.id;
            });
            newState.lastModification = new Date();
            const validatedState = checkRepeatedRequests(newState);
            return validatedState;
        }

        case 'set': {
            const newState = {...state, ...action.value};
            return newState;
        }

        default: {
            throw new Error(`Unhandled action type`);
        }
    }
};
