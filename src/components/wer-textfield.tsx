import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

interface InputProps {
    readonly warning: boolean;
}

const Input = styled.input<InputProps>`
  padding: 2px;
  width: 100%;
  border: ${props => props.warning ? '2px solid red !important' : '1px solid #ddd !important'};
`;

export interface WerTextfieldProps {
    name: string,
    id: string,
    content?: string, 
    placeholder?: string,
    warning?: boolean,
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
                                onChange={(e) => setStore(this.props, e)} 
                                warning={this.props.warning}   
                            />
                            )
                        }}
                    </StoreContextConsumer>
                )
    }
}