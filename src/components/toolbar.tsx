import * as React from 'react';
import { CSVLink } from 'react-csv';

import { updateServerState, RedirectsManagerStateInterface, Dispatch, RedirectionProps } from '../lib/redirects-manager-state';
import { ListRedirections } from './list-redirections';
import { Paginator } from './paginator';

import { sortByMultipleProperties } from '../lib/utils';

interface ButtonsProps extends React.DOMAttributes<HTMLAnchorElement> {
    toggle?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

interface ToolbatProps  {
    state: RedirectsManagerStateInterface;
    dispatch: Dispatch;
}

const AddNew = ({onClick}: ButtonsProps) => {
    return (
    <a className="button" onClick={onClick} >
      Add
    </a>
    );
};

const Save = ({toggle, onClick}: ButtonsProps) => {
    const txt = toggle ? 'Saving' : 'Save';
    return (
    <a className="button button-primary"
        onClick={onClick}
        style={{marginLeft: '5px', cursor: toggle ? 'wait' : 'pointer'}}
        >
      { txt }
    </a>
    );
};

const filter = (
    redirects: RedirectionProps[],
    filterBy: string,
    orderby: string,
    sort: 'asc' | 'desc' = 'asc',
    ) => {
    let view: RedirectionProps[] = [...redirects];
    if (filterBy && filterBy !== '') {
        view = view.filter((el) => {
            return (
                (el.request ? el.request.includes(filterBy) : true) ||
                (el.destination ? el.destination.includes(filterBy) : true)
            );
        });
    }
    view = view.sort((a, b) => sortByMultipleProperties(a, b, [orderby, 'order']));
    if (sort === 'desc') { view.reverse(); }
    view.forEach((redirection, index) => {
        redirection.viewPosition = index + 1;
    });
    return view;
};

const paginate = (
    view: RedirectionProps[],
    perPage: number,
    currentPage: number,
    ) => {
        const countPerPage = perPage ? perPage : view.length;
        const page = currentPage ? currentPage : 1;
        return view.slice((page - 1) * countPerPage, (page * countPerPage) );
};

const csvHeaders = [
    { label: 'Order', key: 'order' },
    { label: 'Request', key: 'request' },
    { label: 'Destination', key: 'destination' },
    { label: 'Last Modification', key: 'modificationDate' },
    { label: 'Duplicated?', key: 'warningRequestDuplication' }
  ];

export const Toolbar = ({state, dispatch}: ToolbatProps) => {
    const filtered = filter(state.redirects, state.filterBy, state.orderBy);
    const paginated = paginate(filtered, state.perPage, state.currentPage);
    return (
        <div>
        <table className="widefat" id="toolbar" style={{width: '100%'}}>
            <tbody>
            <tr>
                <th>
                    <div className="wer-toolbar">
                        <div className="alignleft actions" style={{display: 'flex'}}>
                        <AddNew onClick={(e) => dispatch({type: 'add', value: null})} />
                        <Save onClick={
                            !state.saving ? () => updateServerState({dispatch, state})
                            : event.preventDefault}
                            toggle={state.saving}/>
                        <CSVLink
                            data={filtered}
                            style={{marginLeft: '10px'}}
                            filename={'redirects.csv'}
                            headers={csvHeaders}
                            className="button">Download as CSV</CSVLink>
                        </div>
                        <div className="alignright actions" style={{display: 'flex'}}>
                            <label htmlFor="filterby" style={{marginRight: '5px', marginTop: '5px'}}>
                                Search:
                            </label>
                            <input
                                onChange={(e) => dispatch(
                                    {
                                        type: 'set',
                                        value: {filterBy: e.target.value, currentPage: 1}
                                    }
                                )}
                                type="text"
                                defaultValue={state.filterBy}
                                style={{padding: '1px', width: '100%' }}
                                id="filterby"
                                name="filterby"/>
                        </div>
                    </div>
                </th>
            </tr>
            </tbody>
        </table>
        <ListRedirections
            view={paginated}
            orderBy={state.orderBy}
            dispatch={dispatch} />
        <Paginator
                    redirectsLength={state.redirects.length}
                    viewLength={filtered.length}
                    currentPage={state.currentPage}
                    perPage={state.perPage}
                    dispatch={dispatch}
                    filtered={(state.filterBy && state.filterBy !== '')} />
        </div>
    );

};
Toolbar.displayName = 'Toolbar';
