import * as React from 'react';
import { mountComponent } from 'mount-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { useRedirectsManagerDispatch, 
         useRedirectsManagerState, 
         RedirectsManagerProvider, 
         RedirectsManagerContextInterface,
         RedirectionProps,
         RedirectionsStore
        } from './lib/redirects-manager-context';

import { validateLoad } from './lib/utils';

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
        <table className='widefat'>
            <thead>
                <tr>
                    <th colSpan={5}>
                        <Toolbar />
                    </th>
                </tr>
                <tr>
                    <th colSpan={2} >Request</th>
                    <th>Destination</th>
                    <th>Last Modification</th>
                    <th>Action</th>
                </tr>
            </thead>
                <ListRedirections />
            <tfoot>
                <tr>
                    <th colSpan={5}>
                        <Toolbar />
                    </th>
                </tr>
            </tfoot>
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
        const validatedStote = validateLoad(this.props.initialState.store);
        return (                   
        <RedirectsManagerProvider>
            <RedirectsManagerComponent initialState={{...this.props.initialState, store: validatedStote}} />
            <ToastContainer position='bottom-right'/>
        </RedirectsManagerProvider>
        )
    }
}

mountComponent('#redirects_manager', RedirectsManager);
