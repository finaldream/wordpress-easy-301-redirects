import * as React from 'react';

import { Dispatch } from '../lib/redirects-manager-state';

type getPageNumbersType = (viewLength: number, perPage: number) => number[];

type validateSelectedPageType = (input: string, max: number) => number;

interface PaginatorComponentProps {
    viewLength: number;
    filterBy: string;
    storeLength: number;
    perPage: number;
    currentPage: number;
    dispatch: Dispatch;
}

interface PageSelectorProps { pageNumbers: number[]; current: number; dispatch: Dispatch; }

const getPageNumbers: getPageNumbersType = (viewLength, perPage) => {
    const pageNumbers = [];
    const calculatedPerPage = perPage ? perPage : viewLength;
    for (let i = 1; i <= Math.ceil(viewLength / calculatedPerPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
};

const validateSelectedPage: validateSelectedPageType = (input, max) => {
    const page = Number(input);
    if (page < 1) { return 1; }
    if (page > max) { return max; }
    return page;
};

const PageSelector = ( { pageNumbers, current, dispatch }: PageSelectorProps) => {
    const currentPage = current ? current : 1;
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
                    type: 'set-current-page',
                    value: validateSelectedPage(e.target.value, lastPage)
                })} />
            <span  style={{marginLeft: '5px', marginTop: '6px'}}>of {lastPage}</span>
        </div>
    );
};

export const Paginator = ({
    viewLength,
    filterBy,
    storeLength,
    perPage, currentPage,
    dispatch }: PaginatorComponentProps) => {
    const filteredCount = (filterBy && filterBy !== '') ? `(Current search: ${viewLength})` : '';
    return (
        <tr>
            <th colSpan={5}>
                <hr/>
                Redirects: {storeLength} { filteredCount }
                <PageSelector
                    pageNumbers={getPageNumbers(viewLength, perPage)}
                    current={currentPage} dispatch={dispatch} />
            </th>
        </tr>
    );
};
