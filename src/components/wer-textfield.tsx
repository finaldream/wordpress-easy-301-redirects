import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

const Input = styled.input`
  padding: 2px;
  width: 100%;
`;

export interface WerTextfieldProps {
    name: string,
    content?: string, 
    placeholder?: string,
}

export class WerTextfield extends React.Component<WerTextfieldProps, {}> {
    
    public render(): JSX.Element {
        return (
                <Input type="text" 
                    name={this.props.name}
                    value={this.props.content} 
                    placeholder={this.props.placeholder} />
        )
    }
}