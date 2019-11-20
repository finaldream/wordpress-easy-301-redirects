import * as React from "react";

import { useRedirectsManagerState, useRedirectsManagerDispatch, updateServerState } from '../lib/redirects-manager-context';

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
    const state = useRedirectsManagerState();
    return (
    <a className="button" onClick={(e) => updateServerState({dispatch, state})}  style={{marginLeft: '5px'}}>
      Save Redirections
    </a>
    )
};

export const Toolbar : React.FunctionComponent = () => {
    const state = useRedirectsManagerState();
    const dispatch = useRedirectsManagerDispatch();
    return (
        <thead>
            <tr>
                <th colSpan={5}>
                    <div className='wer-toolbar'>
                        <div className='alignleft actions' style={{display: 'flex'}}>
                        <AddNew />
                        <Save />
                        <input type='checkbox' 
                            style={{marginTop: '5px'}}
                            name='e301r-wildcard'
                            checked={state.wildcard}
                            onChange={() => dispatch({type: 'set', value: {...state, wildcard: !state.wildcard}})}
                        />
                        <label htmlFor='e301r-wildcard' style={{marginLeft: '5px', marginTop: '5px'}}>Use Wildcard?</label>
                        </div>
                        <div className='alignright actions' style={{display: 'flex'}}>
                            <label htmlFor='wer-filterby' style={{marginRight: '5px', marginTop: '5px'}}>Search: </label>
                            <input 
                                onChange={(e) => dispatch({type: 'set', value: {...state, filterBy: e.target.value, currentPage: 1}})}
                                type='text'
                                defaultValue={state.filterBy}
                                style={{padding: '1px', width: '100%' }}
                                id='wer-filterby'
                                name='wer-filterby'/>
                        </div>
                    </div>
                </th>
            </tr>
        </thead>
    )

}