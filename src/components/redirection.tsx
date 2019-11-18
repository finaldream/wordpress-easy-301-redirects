import * as React from 'react';
import styled from "styled-components";

import { useRedirectsManagerDispatch, RedirectionProps } from '../lib/redirects-manager-context';

const Input = styled.input`
  padding: 2px;
  font-size: 0.9em;
  width: 100%;
`;

type RedirectionComponentProps = {
    redirection: RedirectionProps
}

export const Redirection = ( {redirection} : RedirectionComponentProps ) => {
    const dispatch = useRedirectsManagerDispatch();
    const handleEdition = (e : React.ChangeEvent<HTMLInputElement>) => dispatch({type: 'edit', value: {...redirection, [e.target.name]: e.target.value}});
    return (
        <tr>
            <td>
                <Input 
                    type='text'
                    name="redirection"
                    defaultValue={redirection.request}
                    onChange={(e) => handleEdition(e)}
                />
            </td>
            <td>&raquo;</td>
            <td>
                <Input 
                    type='text'
                    name="destination"
                    defaultValue={redirection.destination}
                    onChange={(e) => handleEdition(e)}
                />
            </td>
            <td>{redirection.modificationDate}</td>
            <td>
            <a className="button" onClick={() => dispatch({type: 'remove', value: redirection})} >
                Delete
            </a>
            </td>
        </tr>
    )
}