import * as React from 'react';

import { WerButton } from './wer-button';
import { WerTextfield } from './wer-textfield';
import { StoreContextConsumer, WerRedirectionData } from '../lib/store-context';
 
export interface RedirectionProps {
    id: React.ReactText
}

export class WerRedirection extends React.Component<RedirectionProps, {}> {
    
    public render(): JSX.Element {
        return (
            <StoreContextConsumer>
                { (store) => {
                     let redirectionState  : WerRedirectionData = store.find((el) => {
                        return el.id === this.props.id;
                    }, this);
                    if (!redirectionState) redirectionState = {id: this.props.id, request: null, destination: null, modificationDate: null };
                    return (
                        <tr id={this.props.id.toString()}>
                            <td>
                                <WerTextfield name="wer_request" content={redirectionState.request} />
                            </td>
                            <td>&raquo;</td>
                            <td>
                                <WerTextfield name="wer_destination" content={redirectionState.destination}/>
                            </td>
                            <td>{redirectionState.modificationDate}</td>
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
                