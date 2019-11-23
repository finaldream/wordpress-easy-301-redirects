import * as React from 'react';
import { RedirectionProps, Dispatch } from '../lib/redirects-manager-state';

import { Redirection } from './redirection';
import { Paginator } from './paginator';

interface ListRedirectionsProps {
    view: RedirectionProps[];
    dispatch: Dispatch;
}

export const ListRedirections: React.FunctionComponent<ListRedirectionsProps> = (
    {view, dispatch}: ListRedirectionsProps) => {
    return (
        <table className="widefat" id="view" style={{width: '100%'}}>
            <thead>
                <tr>
                    <th style={{width: '41%'}} >Request</th>
                    <th style={{width: '2%'}} ></th>
                    <th style={{width: '41%'}} >Destination</th>
                    <th style={{width: '11%'}} >Last Modification</th>
                    <th style={{width: '5%', textAlign: 'center'}} >Action</th>
                </tr>
            </thead>
            <tbody>
                {
                view.map((redirection) => {
                    return <Redirection key={redirection.id} redirection={redirection} dispatch={dispatch} />;
                })
                }
            </tbody>
        </table>
    );
};
ListRedirections.displayName = 'ListRedirections';
