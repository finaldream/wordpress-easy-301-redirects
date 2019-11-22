import * as React from 'react';
import { RedirectionProps, Dispatch } from '../lib/redirects-manager-state';
import { sortByMultipleProperties } from '../lib/utils';

import { Redirection } from './redirection';
import { Paginator } from './paginator';

type getViewType = (
    redirects: RedirectionProps[],
    filterBy: string,
    orderby?: string,
    sort?: 'asc' | 'desc'
    ) => RedirectionProps[];

interface ListRedirectionsProps {
    redirects: RedirectionProps[];
    filterBy: string;
    perPage: number;
    currentPage: number;
    dispatch: Dispatch;
}

type paginateViewType = (redirects: RedirectionProps[],  perPage: number, currentPage: number) => RedirectionProps[];

const getView: getViewType = (redirects, filterBy, orderby = 'modificationDate', sort = 'asc') => {
    let view: RedirectionProps[] = [...redirects];
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

const paginateView: paginateViewType = (redirects, perPage, currentPage) => {
    const countPerPage = perPage ? perPage : redirects.length;
    const page = currentPage ? currentPage : 1;
    return redirects.slice((page - 1) * countPerPage, (page * countPerPage) );
};

export const ListRedirections: React.FunctionComponent<ListRedirectionsProps> = (
    {redirects, filterBy, perPage, currentPage, dispatch}: ListRedirectionsProps) => {
    const view = getView(redirects, filterBy);
    const paginated = paginateView(view, perPage, currentPage);
    return (
        <tbody>
            {
            paginated.map((redirection) => {
                return <Redirection key={redirection.id} redirection={redirection} dispatch={dispatch} />;
            })
            }
            <Paginator
                redirectsLength={redirects.length}
                viewLength={view.length}
                currentPage={currentPage}
                perPage={perPage}
                dispatch={dispatch}
                filterBy={filterBy} />
        </tbody>
    );
};
ListRedirections.displayName = 'ListRedirections';
