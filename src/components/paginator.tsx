import * as React from 'react';

import { Dispatch } from '../lib/redirects-manager-state';

interface PaginatorComponentProps {
    viewLength: number;
    filtered: boolean;
    redirectsLength: number;
    perPage: number;
    currentPage: number;
    dispatch: Dispatch;
}

interface PageSelectorProps { pageNumbers: number[]; current: number; dispatch: Dispatch; }

interface PerPageSelectorProps { perPage: number; dispatch: Dispatch; }

const getPageNumbers = (viewLength: number, perPage: number) => {
    const pageNumbers = [];
    const calculatedPerPage = perPage ? perPage : viewLength;
    for (let i = 1; i <= Math.ceil(viewLength / calculatedPerPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
};

const validateSelectedPage = (input: string, max: number) => {
    const page = Number(input);
    if (page < 1) { return 1; }
    if (page > max) { return max; }
    return page;
};

const PerPageSelector = ({perPage, dispatch} : PerPageSelectorProps) => {
    const options = [25, 50, 100];
    return (
        <div style={{display: 'inline-flex', marginLeft: '30px'}}>
        Show:&nbsp;   {
        options.map((option) => {
            const optionHTML = (option !== perPage) ?
                <a style={{cursor: 'pointer'}} onClick={(e) => dispatch({type: 'set', value: {perPage: option} })}>{option}</a> :
                <span style={{cursor: 'default'}} >{option}</span>;
            const separator = (Math.max(...options) !== option) ? '|' : null;
            return <div>&nbsp;{optionHTML}&nbsp;{separator}</div>
        })
        }</div>
    )
}

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
    filtered,
    redirectsLength,
    perPage, currentPage,
    dispatch }: PaginatorComponentProps) => {
    const filteredCount = filtered ? `(Current search: ${viewLength})` : '';
    return (
        <table className="widefat" id="paginator" style={{width: '100%'}}>
            <tr>
                <th>
                    <div className="alignleft actions" style={{display: 'flex'}}>
                        Redirects: {redirectsLength} { filteredCount }
                        <PerPageSelector perPage={perPage} dispatch={dispatch} />
                    </div>
                    <PageSelector
                        pageNumbers={getPageNumbers(viewLength, perPage)}
                        current={currentPage} dispatch={dispatch} />
                </th>
            </tr>
        </table>
    );
};
