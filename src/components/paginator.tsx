import * as React from 'react';
import Pagination from 'react-js-pagination';

import { Dispatch } from '../lib/redirects-manager-state';

interface PaginatorComponentProps {
    viewLength: number;
    filtered: boolean;
    redirectsLength: number;
    perPage: number;
    currentPage: number;
    dispatch: Dispatch;
}

interface PerPageSelectorProps { perPage: number; dispatch: Dispatch; }

const getPageNumbers = (viewLength: number, perPage: number) => {
    const pageNumbers = [];
    const calculatedPerPage = perPage ? perPage : viewLength;
    for (let i = 1; i <= Math.ceil(viewLength / calculatedPerPage); i++) {
        pageNumbers.push(i);
    }
    return pageNumbers;
};

const PerPageSelector = ({perPage, dispatch}: PerPageSelectorProps) => {
    const options = [25, 50, 100];
    return (
        <div style={{display: 'inline-flex', marginLeft: '30px'}}>
        Show:&nbsp;   {
        options.map((option) => {
            const optionHTML = (option !== perPage) ?
                <a style={{ cursor: 'pointer' }} onClick={
                    () => dispatch({type: 'set', value: {perPage: option, currentPage: 1}
                })}>{option}</a> :
                <span style={{cursor: 'default'}} >{option}</span>;
            const separator = (Math.max(...options) !== option) ? '|' : null;
            return <div key={option}>&nbsp;{optionHTML}&nbsp;{separator}</div>;
        })
        }</div>
    );
};

export const Paginator = ({
    viewLength,
    filtered,
    redirectsLength,
    perPage,
    currentPage,
    dispatch }: PaginatorComponentProps) => {
    const filteredCount = filtered ? `(Current search: ${viewLength})` : '';
    const listPositionHint = `Viewing from: ${(perPage * currentPage) - (perPage - 1 )} to ${Math.min(perPage * currentPage, viewLength)}`;
    return (
        <table className="widefat" id="paginator" style={{width: '100%'}}>
            <tbody>
            <tr>
                <th>
                    <div className="alignleft actions" style={{display: 'flex', marginTop: '15px'}}>
                        Redirects: {redirectsLength} { filteredCount } - { listPositionHint }
                        <PerPageSelector perPage={perPage} dispatch={dispatch} />
                    </div>
                    <div className="alignright actions" style={{display: 'flex'}}>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={viewLength}
                            pageRangeDisplayed={5}
                            onChange={(pageNumber: number) => dispatch({type: 'set', value: {currentPage: pageNumber}})}
                            itemClass={'button'}
                        />
                    </div>
                </th>
            </tr>
            </tbody>
        </table>
    );
};
