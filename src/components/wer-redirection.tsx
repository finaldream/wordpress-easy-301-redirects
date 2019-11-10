import * as React from 'react';

import { WerButton } from './wer-button';
import { WerTextfield } from './wer-textfield';

export interface RedirectionProps {
    id: string,
    request?: string,
    destination?: string,
    modificationDate?: string
}

export class WerRedirection extends React.Component<RedirectionProps, {}> {
    
    public render(): JSX.Element {
        return (
            <tr id={this.props.id}>
                <td>
                    <WerTextfield name="wer_request" />
                </td>
                <td>&raquo;</td>
                <td>
                    <WerTextfield name="wer_destination" />
                </td>
                <td>{this.props.modificationDate}</td>
                <td>
                    <WerButton />
                </td>
            </tr>
        )
    }
}
                