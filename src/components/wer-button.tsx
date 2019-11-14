import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

const BaseButton = ({ children, callback }) => (
    <a className="button" onClick={callback} >
      {children}
    </a>
 );

const StyledButton = styled(BaseButton)`
  border: 1px solid #000;
  background: gray;
`;

export interface WerButtondProps { caption: string, callback?: CallableFunction}

export class WerButton extends React.Component<WerButtondProps, {}> {

    public static defaultProps = {
        caption: "Delete",
        callback: () => {}
    };

    public render(): JSX.Element {
        return (
            <StyledButton callback= {this.props.callback}>
                { this.props.caption }
            </StyledButton>
        )
    }
}