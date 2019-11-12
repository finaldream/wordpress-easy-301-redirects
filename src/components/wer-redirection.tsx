import * as React from 'react';

import { WerButton } from './wer-button';
import { WerTextfield } from './wer-textfield';
import { StoreContextConsumer } from '../lib/store-context';
 
export interface RedirectionProps {
    id: React.ReactText;
}

export class WerRedirection extends React.Component<RedirectionProps, {}> {
    
    constructor(props) {
        super(props);
    }
    
    public render(): JSX.Element {
        return (
            <StoreContextConsumer>
                { ({ getRedirection }) => {
                    const redirection = getRedirection(this.props.id);
                    return (
                        <tr id={redirection.id.toString()}>
                            <td>
                                <WerTextfield name="request" content={redirection.request} id={this.props.id} />
                            </td>
                            <td>&raquo;</td>
                            <td>
                                <WerTextfield name="destination" content={redirection.destination} id={this.props.id} />
                            </td>
                            <td>{redirection.modificationDate}</td>
                            <td>
                                <WerButton />
                            </td>
                        </tr>
                    )
                }}
            </StoreContextConsumer>
        )
    }
}
                