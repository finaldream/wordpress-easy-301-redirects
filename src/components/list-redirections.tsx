import * as React from 'react';
import { RedirectionProps, Dispatch } from '../lib/redirects-manager-state';

import { Redirection } from './redirection';
import { Paginator } from './paginator';

interface ListRedirectionsProps {
    view: RedirectionProps[];
    orderBy: string;
    dispatch: Dispatch;
}

interface ColumnSorterProps {
    orderBy: string;
    name: string;
    field: string;
    dispatch: Dispatch;
    columnStyle?: React.CSSProperties;
}

const ColumnSorter = ({orderBy, name, field, dispatch, columnStyle}: ColumnSorterProps) => {
    let classes: string;
    let indicator: React.ReactNode;
    let newValue: string;
    if (orderBy === '') {
        classes = 'manage-column sorted';
        indicator = null;
        newValue = `-${field}`;
    } else if (orderBy[0] === '-') {
        classes = 'manage-column column-modified sorted asc';
        indicator = <span className="sorting-indicator"></span>;
        newValue = field;
    } else {
        classes = 'manage-column column-modified sorted desc';
        indicator = <span className="sorting-indicator"></span>;
        newValue = '';
    }
    return (
        <th style={columnStyle} className={classes} >
            <a onClick={() => dispatch({type: 'set', value: {orderBy: newValue}})}>
                <span>{ name }</span>
                { indicator }
            </a>
        </th>
    );
};

export const ListRedirections: React.FunctionComponent<ListRedirectionsProps> = (
    {view, orderBy, dispatch}: ListRedirectionsProps) => {
    return (
        <table className="widefat" id="view" style={{width: '100%'}}>
            <thead>
                <tr>
                    <th style={{width: '1%'}} >#</th>
                    <th style={{width: '40%'}} >Request</th>
                    <th style={{width: '2%'}} ></th>
                    <th style={{width: '40%'}} >Destination</th>
                    <ColumnSorter
                        columnStyle={{width: '12%'}}
                        orderBy={orderBy}
                        name="Last Modification"
                        dispatch={dispatch}
                        field="modificationDate" />
                    <th style={{width: '5%', textAlign: 'center'}} >Action</th>
                </tr>
            </thead>
            <tbody>
                {
                view.map((redirection, index) => {
                    return <Redirection
                        key={redirection.id}
                        redirection={redirection}
                        dispatch={dispatch}/>;
                })
                }
            </tbody>
        </table>
    );
};
ListRedirections.displayName = 'ListRedirections';
