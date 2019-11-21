import * as React from 'react';

import { updateServerState, RedirectsManagerStateInterface, Dispatch } from '../lib/redirects-manager-state';

interface ButtonsProps extends React.DOMAttributes<HTMLAnchorElement> {
    toggle?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

interface ToolbatProps  {
    state: RedirectsManagerStateInterface;
    dispatch: Dispatch;
}

const AddNew = ({onClick}: ButtonsProps) => {
    return (
    <a className="button" onClick={onClick} >
      Add new Redirection
    </a>
    );
};

const Save = ({toggle, onClick}: ButtonsProps) => {
    const txt = toggle ? 'Saving...' : 'Save Redirections';
    return (
    <a className="button"
        onClick={onClick}
        style={{marginLeft: '5px', cursor: toggle ? 'wait' : 'pointer'}}
        >
      { txt }
    </a>
    );
};

export const Toolbar = ({state, dispatch}: ToolbatProps) => {
    return (
        <thead>
            <tr>
                <th colSpan={5}>
                    <div className="wer-toolbar">
                        <div className="alignleft actions" style={{display: 'flex'}}>
                        <AddNew onClick={(e) => dispatch({type: 'add', value: null})} />
                        <Save onClick={
                            !state.saving ? () => updateServerState({dispatch, state})
                            : event.preventDefault}
                            toggle={state.saving}/>
                        <input type="checkbox"
                            style={{marginTop: '5px'}}
                            name="e301r-wildcard"
                            checked={state.wildcard}
                            onChange={() => dispatch({type: 'toggle-wildcard' , value: !state.wildcard })}
                        />
                        <label htmlFor="e301r-wildcard" style={{marginLeft: '5px', marginTop: '5px'}}>
                            Use Wildcard?
                        </label>
                        </div>
                        <div className="alignright actions" style={{display: 'flex'}}>
                            <label htmlFor="wer-filterby" style={{marginRight: '5px', marginTop: '5px'}}>
                                Search:
                            </label>
                            <input
                                onChange={(e) => dispatch(
                                    {
                                        type: 'set-filter',
                                        value: e.target.value
                                    }
                                )}
                                type="text"
                                defaultValue={state.filterBy}
                                style={{padding: '1px', width: '100%' }}
                                id="wer-filterby"
                                name="wer-filterby"/>
                        </div>
                    </div>
                </th>
            </tr>
        </thead>
    );

};
Toolbar.displayName = 'Toolbar';
