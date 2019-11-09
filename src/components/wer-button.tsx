import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

const BaseButton = ({ children }) => (
    <a className="button">
      {children}
    </a>
 );

const StyledButton = styled(BaseButton)`
  border: 1px solid #000;
  background: gray;
`;

export interface WerButtondProps { caption: string}

export class WerButton extends React.Component<WerButtondProps, {}> {

    public static defaultProps = {
        caption: "Delete"
    };

    public render(): JSX.Element {
        return (
            <StyledButton>
                { this.props.caption }
            </StyledButton>
        )
    }
}