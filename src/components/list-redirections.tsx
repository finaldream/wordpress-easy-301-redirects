import * as React from "react";
import { useRedirectsManagerState, RedirectionsStore, RedirectsManagerContextInterface } from '../lib/redirects-manager-context';
import { sortByMultipleProperties } from '../lib/utils';

import { Redirection } from "./redirection"

type getView = (state : RedirectsManagerContextInterface, orderby?: string, sort?: 'asc' | 'desc' ) => RedirectionsStore;

const getView : getView = (state, orderby = 'modificationDate', sort = 'asc') => {
    let view : RedirectionsStore = [...state.store];
    if (state.filterBy && state.filterBy !== '') {
        view = view.filter((el) => {
            return (
                (el.request ? el.request.includes(state.filterBy) : true) || 
                (el.destination ? el.destination.includes(state.filterBy) : true)
            );
        })
    }
    view = view.sort((a, b) => sortByMultipleProperties(a, b, [`-${orderby}`, 'order']));
    if(sort === 'desc') view.reverse();
    return view;
}


export const ListRedirections : React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    const view = getView(state);
    return (
        <tbody>
        {
        view.map((redirection)=> {
            return <Redirection key={redirection.id} redirection={redirection} />
        })
        }
        </tbody>
    
    )
}