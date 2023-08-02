import * as React from 'react';
import styled from 'styled-components';

import { RedirectionProps, Dispatch } from '../lib/redirects-manager-state';

interface InputProps {
    readonly warning?: boolean;
}
interface RedirectionComponentProps {
    redirection: RedirectionProps;
    dispatch: Dispatch;
}

const Input = styled.input<InputProps>`
  padding: 2px;
  font-size: 0.9em;
  width: 100%;
  border: ${(props) => props.warning ? '2px solid red !important' : '1px solid #ddd !important'};
`;

export const Redirection = ( {redirection, dispatch}: RedirectionComponentProps ) => {
    const handleEdition = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(
        {
            type: 'edit',
            value: {...redirection, [e.target.name]: e.target.value}
        }
    );
    return (
        <tr>
            <td style={{verticalAlign: 'middle'}}>{redirection.viewPosition}</td>
            <td>
                <Input
                    type="text"
                    name="request"
                    defaultValue={redirection.request}
                    onChange={(e) => handleEdition(e)}
                    warning={redirection.warningRequestDuplication}
                />
            </td>
            <td>&raquo;</td>
            <td>
                <Input
                    type="text"
                    name="destination"
                    defaultValue={redirection.destination}
                    onChange={(e) => handleEdition(e)}
                />
            </td>
            <td>{ typeof redirection.modificationDate === 'string' ?
                    'not saved' :
                    redirection.modificationDate === null || typeof redirection.modificationDate === 'undefined' ?
                        'not saved' :
                        `${redirection.modificationDate.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: '2-digit'})} ${redirection.modificationDate.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit',  hour12: false})}`
                }</td>
            <td>
            <a className="button" onClick={() => dispatch({type: 'remove', value: redirection})} >
                Delete
            </a>
            </td>
        </tr>
    );
};
Redirection.displayName = 'Redirection';
