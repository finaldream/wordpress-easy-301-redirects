import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

const Input = styled.input`
  padding: 2px;
  width: 100%;
`;

export interface WerTextfieldProps {
    name: string,
    id: React.ReactText,
    content?: string, 
    placeholder?: string,
}

export class WerTextfield extends React.Component<WerTextfieldProps, {}> {
    
    public render(): JSX.Element {
                return (
                    <StoreContextConsumer>
                        { ({ setStore }) => {
                            return (
                            <Input type="text" 
                                name={this.props.name}
                                defaultValue={this.props.content} 
                                placeholder={this.props.placeholder}
                                onChange={(e) => setStore(this.props, e)} />
                            )
                        }}
                    </StoreContextConsumer>
                )
    }
}