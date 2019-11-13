import * as React from 'react';

import { WerButton } from './wer-button';
import { WerTextfield } from './wer-textfield';
import { StoreContextConsumer, WerRedirectionData } from '../lib/store-context';
 
export interface RedirectionProps {
    id: string;
}

export class WerRedirection extends React.Component<RedirectionProps, {}> {
    
    constructor(props) {
        super(props);
    }
    
    public render(): JSX.Element {
        return (
            <StoreContextConsumer>
                { ({ getRedirection, deleteRedirection }) => {
                    const redirection : WerRedirectionData = getRedirection(this.props.id);
                    return (
                        <tr id={redirection.id}>
                            <td>
                                <WerTextfield name="request" content={redirection.request} id={this.props.id} warning={redirection.warningRequestDuplication} />
                            </td>
                            <td>&raquo;</td>
                            <td>
                                <WerTextfield name="destination" content={redirection.destination} id={this.props.id} />
                            </td>
                            <td>{redirection.modificationDate}</td>
                            <td>
                                <WerButton callback={() => deleteRedirection(this.props.id)} />
                            </td>
                        </tr>
                    )
                }}
            </StoreContextConsumer>
        )
    }
}
                