import * as React from 'react';

import { useRedirectsManagerState, useRedirectsManagerDispatch, RedirectionsStore } from '../lib/redirects-manager-context';

type getPageNumbers = (view: RedirectionsStore, perPage: number) => number[];

const getPageNumbers: getPageNumbers = (view, perPage) => {
    const pageNumbers = [];
    const totalRedirections = view.length;
    const calculatedPerPage = perPage ? perPage : totalRedirections;
    for (let i = 1; i <= Math.ceil(totalRedirections / calculatedPerPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
};

type validateSelectedPage = (input: string, max: number) => number;

const validateSelectedPage: validateSelectedPage = (input, max) => {
    const page = Number(input);
    if (page < 1) { return 1; }
    if (page > max) { return max; }
    return page;
};

interface PageSelectorProps { pageNumbers: number[]; }

const PageSelector = ( { pageNumbers }: PageSelectorProps) => {
    const state = useRedirectsManagerState();
    const dispatch = useRedirectsManagerDispatch();
    const currentPage = state.currentPage ? state.currentPage : 1;
    const lastPage = pageNumbers[pageNumbers.length - 1];
    return (
        <div className="alignright actions" style={{display: 'flex'}}>
            <span  style={{ marginTop: '6px'}}>Page </span>
            <input type="number"
                style={{width: '35px', background: 'transparent', cursor: 'default', border: 'none'}}
                min={pageNumbers[0]}
                max={lastPage}
                value={currentPage}
                onChange={ (e) => dispatch({
                    type: 'set',
                    value: {
                        ...state,
                        currentPage: validateSelectedPage(e.target.value, lastPage)
                    }
                })} />
            <span  style={{marginLeft: '5px', marginTop: '6px'}}>of {lastPage}</span>
        </div>
    );
};

interface PaginatorComponentProps {
    view: RedirectionsStore;
}

export const Paginator = ({ view }: PaginatorComponentProps) => {
    const state = useRedirectsManagerState();
    const filteredCount = (state.filterBy && state.filterBy !== '') ? `(Current search: ${view.length})` : '';
    return (
        <tr>
            <th colSpan={5}>
                <hr/>
                Redirects: {state.store.length} { filteredCount }
                <PageSelector pageNumbers={getPageNumbers(view, state.perPage)} />
            </th>
        </tr>
    );
};
