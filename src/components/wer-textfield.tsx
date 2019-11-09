import * as React from "react";
import { StoreContextConsumer } from '../lib/store-context';

import styled from "styled-components";

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

export interface WerTextfieldProps { content?: string; placeholder?: string; }

export class WerTextfield extends React.Component<WerTextfieldProps, {}> {
    
    public render(): JSX.Element {
        return (
            <Wrapper>
                <input type="text" />
            </Wrapper>
        )
    }
}