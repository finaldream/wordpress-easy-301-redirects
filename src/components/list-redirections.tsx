import * as React from 'react';
import { useRedirectsManagerState, RedirectionsStore, RedirectsManagerContextInterface } from '../lib/redirects-manager-context';
import { sortByMultipleProperties } from '../lib/utils';

import { Redirection } from './redirection';
import { Paginator } from './paginator';

type getViewType = (
    state: RedirectsManagerContextInterface,
    orderby?: string,
    sort?: 'asc' | 'desc' ) => RedirectionsStore;

const getView: getViewType = (state, orderby = 'modificationDate', sort = 'asc') => {
    let view: RedirectionsStore = [...state.store];
    if (state.filterBy && state.filterBy !== '') {
        view = view.filter((el) => {
            return (
                (el.request ? el.request.includes(state.filterBy) : true) ||
                (el.destination ? el.destination.includes(state.filterBy) : true)
            );
        });
    }
    view = view.sort((a, b) => sortByMultipleProperties(a, b, [`-${orderby}`, 'order']));
    if (sort === 'desc') { view.reverse(); }
    return view;
};

type paginateViewType = (state: RedirectsManagerContextInterface, store: RedirectionsStore) => RedirectionsStore;

const paginateView: paginateViewType = (state, store) => {
    const perPage = state.perPage ? state.perPage : store.length;
    const currentPage = state.currentPage ? state.currentPage : 1;
    return store.slice((currentPage - 1) * perPage, (currentPage * perPage) );
};

export const ListRedirections: React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    const view = getView(state);
    const paginated = paginateView(state, view);
    return (
        <tbody>
            {
            paginated.map((redirection) => {
                return <Redirection key={redirection.id} redirection={redirection} />;
            })
            }
            <Paginator view={view} />
        </tbody>
    );
};
