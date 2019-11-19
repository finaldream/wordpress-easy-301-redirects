import * as React from 'react';

import { useRedirectsManagerState, useRedirectsManagerDispatch, RedirectionsStore } from '../lib/redirects-manager-context';

type NumberedButtonsProps = { pageNumbers : Array<number>};

const NumberedButtons = ( {pageNumbers} : NumberedButtonsProps) => {
    const state = useRedirectsManagerState();
    const dispatch = useRedirectsManagerDispatch();
    return (
        <div>
        {
            pageNumbers.map( (value) => {
                return <a type='button' onClick={ () => dispatch({type: 'set', value: {...state, currentPage: value, filterBy: ''}})}>{value}</a>
            })
        }
        </div>
    )
}

type PaginatorComponentProps = {
    view: RedirectionsStore,
    pageNumbers: Array<number>,
    totalStore: number,
}

export const Paginator = ({view, pageNumbers, totalStore} : PaginatorComponentProps) => {    
    return (
        <tr>
            <th colSpan={5}>
                <hr/>
                Viewing {view.length} Redirects of {totalStore} 
                <NumberedButtons pageNumbers={pageNumbers} />
            </th>
        </tr>
    )
}