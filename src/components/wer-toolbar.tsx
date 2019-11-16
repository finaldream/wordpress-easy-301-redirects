import * as React from "react";
import styled from "styled-components";

import { WerButton } from './wer-button';
import { StoreContextConsumer, WerRedirectionData } from '../lib/store-context';

const SearchInput = styled.input`
  padding: 5px !important;
  width: 100%;
`;

export class WerToolbar extends React.Component {
    public render() : JSX.Element {
        return (
            <StoreContextConsumer>
            { ({ createRedirection, saveStore, toggleWildcard, wildcard, setFilter, filterBy }) => {
                return (
                <div className='wer-toolbar'>
                    <div className='alignleft actions'>
                    <WerButton caption='Add new Redirection' callback={createRedirection}/>
                    <WerButton caption='Save Redirections' callback={saveStore} />
                    <input type='checkbox' 
                        name='e301r-wildcard'
                        checked={wildcard}
                        onChange={toggleWildcard}/>
                    <label htmlFor='e301r-wildcard' style={{marginLeft: '5px'}}>Use Wildcard?</label>
                    </div>
                    <div className='alignright actions' style={{display: 'flex'}}>
                        <label htmlFor='wer-filterby' style={{marginRight: '5px', marginTop: '5px'}}>Search: </label>
                        <SearchInput type='text' defaultValue={filterBy} id='wer-filterby' name='wer-filterby' onChange={setFilter}/>
                    </div>
                </div>
                )
            }}
            </StoreContextConsumer>
        )
    }
}