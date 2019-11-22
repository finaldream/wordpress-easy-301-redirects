import * as React from 'react';
import { mountComponent } from 'mount-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { RedirectsManagerStateInterface, redirectsManagerReducer, } from './lib/redirects-manager-state';

import { validateLoad } from './lib/utils';

import { ListRedirections } from './components/list-redirections';
import { Toolbar } from './components/toolbar';

interface RedirectsManagerProps  {
    initialState: RedirectsManagerStateInterface;
}

export const RedirectsManager = ({initialState}: RedirectsManagerProps) => {
    const [state, dispatch] = React.useReducer(redirectsManagerReducer, initialState);
    return (
        <div>
            <table className="widefat" style={{width: '100%'}}>
                <Toolbar dispatch={dispatch} state={state} />
                <thead>
                    <tr>
                        <th style={{width: '41%'}} >Request</th>
                        <th style={{width: '2%'}} ></th>
                        <th style={{width: '41%'}} >Destination</th>
                        <th style={{width: '11%'}} >Last Modification</th>
                        <th style={{width: '5%', textAlign: 'center'}} >Action</th>
                    </tr>
                </thead>
                <ListRedirections
                    store={state.store}
                    filterBy={state.filterBy}
                    perPage={state.perPage}
                    currentPage={state.currentPage}
                    dispatch={dispatch} />
            </table>
            <ToastContainer position="bottom-right"/>
        </div>
    );
};
RedirectsManager.displayName = 'RedirectsManager';

export class MountRedirectsManager extends React.Component<RedirectsManagerProps> {

    public static defaultProps: RedirectsManagerProps = {
        initialState : {store: [], filterBy: '', saving: false, lastModification: null, lastSave: null}
    };

    public static displayName: 'MountRedirectsManager';

    public render(): JSX.Element {
        return (
            <RedirectsManager initialState={validateLoad(this.props.initialState)} />
        );
    }
}

mountComponent('#redirects_manager', MountRedirectsManager);
