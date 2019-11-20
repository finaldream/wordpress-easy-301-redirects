import * as React from 'react';
import { mountComponent } from 'mount-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { useRedirectsManagerDispatch, 
         RedirectsManagerProvider, 
         RedirectsManagerContextInterface,
        } from './lib/redirects-manager-context';

import { validateLoad, checkRepeatedRequests } from './lib/utils';

import { ListRedirections } from './components/list-redirections'
import { Toolbar } from './components/toolbar';

type RedirectsManagerProps  = {
    initialState: RedirectsManagerContextInterface;
}
type RedirectsManagerComponentProps = {
    initialState: RedirectsManagerContextInterface
}

const RedirectsManagerComponent = ( { initialState } : RedirectsManagerComponentProps) => {
    const dispatch = useRedirectsManagerDispatch();
    dispatch({type: 'set', value: initialState})
    return ( 
        <table className='widefat' style={{width: '100%'}}>
            <Toolbar />
            <thead>
                <tr>
                    <th style={{width: '41%'}} >Request</th>
                    <th style={{width: '2%'}} ></th>
                    <th style={{width: '41%'}} >Destination</th>
                    <th style={{width: '11%'}} >Last Modification</th>
                    <th style={{width: '5%', textAlign: 'center'}} >Action</th>
                </tr>
            </thead>
            <ListRedirections />
        </table>
    )
}

export class RedirectsManager extends React.Component<RedirectsManagerProps> {

    public defaultProps : RedirectsManagerProps;

    constructor(props : RedirectsManagerProps) {
        super(props);
    }
        
    public static defaultProps : RedirectsManagerProps = {
        initialState : {wildcard: false, store: [], filterBy: '', saving: false, lastModification: null, lastSave: null}
    };
    
    public render(): JSX.Element {
        const validatedState = validateLoad(this.props.initialState);
        return (                   
        <RedirectsManagerProvider>
            <RedirectsManagerComponent initialState={validatedState} />
            <ToastContainer position='bottom-right'/>
        </RedirectsManagerProvider>
        )
    }
}

mountComponent('#redirects_manager', RedirectsManager);
