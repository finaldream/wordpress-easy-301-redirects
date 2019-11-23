import * as React from 'react';
import { mountComponent } from 'mount-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { RedirectsManagerStateInterface, redirectsManagerReducer, } from './lib/redirects-manager-state';

import { validateLoad } from './lib/utils';

import { Toolbar } from './components/toolbar';

interface RedirectsManagerProps  {
    initialState: RedirectsManagerStateInterface;
}

export const RedirectsManager = ({initialState}: RedirectsManagerProps) => {
    const [state, dispatch] = React.useReducer(redirectsManagerReducer, initialState);
    return (
        <div>
            <Toolbar dispatch={dispatch} state={state} />
            <ToastContainer position="bottom-right"/>
        </div>
    );
};
RedirectsManager.displayName = 'RedirectsManager';

export class MountRedirectsManager extends React.Component<RedirectsManagerProps> {

    public static defaultProps: RedirectsManagerProps = {
        initialState : {redirects: [], filterBy: '', saving: false, lastModification: null, lastSave: null}
    };

    public static displayName: 'MountRedirectsManager';

    public render(): JSX.Element {
        return (
            <RedirectsManager initialState={validateLoad(this.props.initialState)} />
        );
    }
}

mountComponent('#redirects_manager', MountRedirectsManager);
