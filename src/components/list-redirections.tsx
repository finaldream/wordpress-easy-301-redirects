import * as React from 'react';
import { RedirectionProps, Dispatch } from '../lib/redirects-manager-state';
import { sortByMultipleProperties } from '../lib/utils';

import { Redirection } from './redirection';
import { Paginator } from './paginator';

type getViewType = (
    store: RedirectionProps[],
    filterBy: string,
    orderby?: string,
    sort?: 'asc' | 'desc'
    ) => RedirectionProps[];

interface ListRedirectionsProps {
        store: RedirectionProps[];
        filterBy: string;
        perPage: number;
        currentPage: number;
        dispatch: Dispatch;
    }

type paginateViewType = (store: RedirectionProps[],  perPage: number, currentPage: number) => RedirectionProps[];

const getView: getViewType = (store, filterBy, orderby = 'modificationDate', sort = 'asc') => {
    let view: RedirectionProps[] = [...store];
    if (filterBy && filterBy !== '') {
        view = view.filter((el) => {
            return (
                (el.request ? el.request.includes(filterBy) : true) ||
                (el.destination ? el.destination.includes(filterBy) : true)
            );
        });
    }
    view = view.sort((a, b) => sortByMultipleProperties(a, b, [`-${orderby}`, 'order']));
    if (sort === 'desc') { view.reverse(); }
    return view;
};

const paginateView: paginateViewType = (store, perPage, currentPage) => {
    const countPerPage = perPage ? perPage : store.length;
    const page = currentPage ? currentPage : 1;
    return store.slice((page - 1) * countPerPage, (page * countPerPage) );
};

export const ListRedirections: React.FunctionComponent<ListRedirectionsProps> = (
    {store, filterBy, perPage, currentPage, dispatch}: ListRedirectionsProps) => {
    const view = getView(store, filterBy);
    const paginated = paginateView(view, perPage, currentPage);
    return (
        <tbody>
            {
            paginated.map((redirection) => {
                return <Redirection key={redirection.id} redirection={redirection} dispatch={dispatch} />;
            })
            }
            <Paginator
                storeLength={store.length}
                viewLength={view.length}
                currentPage={currentPage}
                perPage={perPage}
                dispatch={dispatch}
                filterBy={filterBy} />
        </tbody>
    );
};
ListRedirections.displayName = 'ListRedirections';
