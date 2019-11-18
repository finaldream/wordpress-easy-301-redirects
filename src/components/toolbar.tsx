import * as React from "react";
import styled from "styled-components";

import { useRedirectsManagerState, useRedirectsManagerDispatch } from '../lib/redirects-manager-context';

const SearchInput = styled.input`
  padding: 1px !important;
  width: 100%;
`;

const AddNew = () => {
    const dispatch = useRedirectsManagerDispatch();
    return (
    <a className="button" onClick={(e) => dispatch({type: 'add', value: null})} >
      Add new Redirection
    </a>
    )
};

const Save = () => {
    const dispatch = useRedirectsManagerDispatch();
    return (
    <a className="button" onClick={(e) => dispatch({type: 'add', value: null})} >
      Save Redirections
    </a>
    )
};

export const Toolbar : React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    const dispatch = useRedirectsManagerDispatch();
    return (
        <div className='wer-toolbar'>
            <div className='alignleft actions'>
            <AddNew />
            <Save />
            <input type='checkbox' 
                name='e301r-wildcard'
                checked={state.wildcard}
                onChange={() => dispatch({type: 'set', value: {...state, wildcard: !state.wildcard}})}
            />
            <label htmlFor='e301r-wildcard' style={{marginLeft: '5px'}}>Use Wildcard?</label>
            </div>
            <div className='alignright actions' style={{display: 'flex'}}>
                <label htmlFor='wer-filterby' style={{marginRight: '5px', marginTop: '5px'}}>Search: </label>
                <SearchInput 
                    onChange={(e) => dispatch({type: 'set', value: {...state, filterBy: e.target.value}})}
                    type='text' defaultValue={state.filterBy} id='wer-filterby' name='wer-filterby'/>
            </div>
        </div>
    )

}