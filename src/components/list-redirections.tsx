import * as React from 'react';
import { useRedirectsManagerState, RedirectionsStore, RedirectsManagerContextInterface } from '../lib/redirects-manager-context';
import { sortByMultipleProperties } from '../lib/utils';

import { Redirection } from './redirection';
import { Paginator } from  './paginator';

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

type getPageNumbers = (state : RedirectsManagerContextInterface) => Array<number>;

const getPageNumbers : getPageNumbers = (state) => {
    const pageNumbers = [];
    const totalRedirections = state.store.length;
    const perPage = state.perPage ? state.perPage : totalRedirections;
    for (let i = 1; i <= Math.ceil(totalRedirections / perPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
} 

type paginateView = (state : RedirectsManagerContextInterface, store: RedirectionsStore) => RedirectionsStore;

const paginateView : paginateView = (state, store) => {
    const perPage = state.perPage ? state.perPage : store.length;
    const currentPage = state.currentPage ? state.currentPage : 1;
    return store.slice((currentPage-1)*perPage, (currentPage*perPage) );
}


export const ListRedirections : React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    const nonPaginatedView = getView(state);
    const view = paginateView(state, nonPaginatedView);
    return (
        <tbody>
            {
            view.map((redirection)=> {
                return <Redirection key={redirection.id} redirection={redirection} />
            })
            }
            <Paginator view={view} pageNumbers={getPageNumbers(state)} totalStore={state.store.length} />
        </tbody>    
    )
}