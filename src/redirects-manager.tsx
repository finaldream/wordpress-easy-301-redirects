import * as React from 'react';

import { v4 } from 'uuid'
import { mountComponent } from 'mount-component';
import { ToastContainer, toast, ToastContent, ToastOptions, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { StoreContextProvider, WerRedirectionsArray, WerRedirectionData, WerContextInterface } from './lib/store-context';
import {sortByProperty, sortByMultipleProperties} from './lib/store-sorter';

import { WerListRedirections } from './components/wer-list-redirections'
import { WerTextfieldProps } from './components/wer-textfield';
import { WerToolbar } from './components/wer-toolbar';
import { EDEADLK } from 'constants';

export interface WerTableProps {
    initialState: {wildcard: boolean, store: Array<WerRedirectionData>};
}

const ajaxUrl : string = (window as any).ajaxurl;

export class WerTable extends React.Component<WerTableProps> {

    private setStore : (args: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => void;
    private getRedirection: (id: string) => WerRedirectionData;
    private createRedirection: () => void;
    private deleteRedirection: (id: string) => void;
    private validateStore: (store : Array<WerRedirectionData>) => Array<WerRedirectionData>;
    private validateLoad: (store : Array<WerRedirectionData>) => Array<WerRedirectionData>;
    private showNotification: (type: TypeOptions, content: ToastContent, options?: ToastOptions) => React.ReactText;
    private saveStore: CallableFunction;
    private toggleWildcard: (e: React.ChangeEvent<HTMLInputElement>) => void;
    private setFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    private view: (orderby?: 'order' | 'request' | 'destination' | 'modificationDate', sort?: 'asc' | 'desc', filterBy?: string ) => Array<WerRedirectionData>;
    public state: WerContextInterface;

    constructor(props) {
        super(props);

        this.setStore = (args: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => {
            let newStore = this.state.store;
            const redirection = newStore.filter((el) => {
                return el.id === args.id;
            })[0];
            if (redirection) {
                redirection[args.name] = e.target.value;
            }
            let newState = this.state;
            newState.store = this.validateStore(newStore);
            this.setState(newState);
        };

        this.getRedirection = (id: string) => {
            return this.state.store.filter((el) => {
                return el.id === id;
            }, this)[0];
        }

        this.deleteRedirection = (id: string) => {
            const newStore = this.state.store.filter((el) => {
                return el.id !== id;
            });
            let newState = this.state;
            newState.store = this.validateStore(newStore);
            this.setState(newState)
        }

        this.validateStore = (store) => {
            const validatedStore: Array<WerRedirectionData> = store.map((redirection) => {
                if(redirection.request && redirection.request !== '') {
                    const colliders = store.filter(el => {
                        return el.request === redirection.request;
                    })
                    redirection.warningRequestDuplication = colliders.length > 1;
                } else {
                    redirection.warningRequestDuplication = false;
                }
                return redirection
            })
            return validatedStore;
        }

        this.showNotification = (type, content, options = {}) => {
            options.type = type;
            return toast(content, options);
        }

        this.validateLoad = (store) => {
            let valid = true;
            const validatedLoad: Array<WerRedirectionData> = store.map((redirection) => {
                if (!redirection.id || redirection.id === '') {
                    redirection.id = v4();
                    valid = false;
                } 
                return redirection
            })
            if (!valid) this.showNotification('info', 'Data imported from old Simple301 plugin. Please review and save your changes to commit. After saving please deactivate the old plugin.');
            return this.validateStore(validatedLoad);
        }

        this.setFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
            let newState = this.state;
            newState.filterBy = e.target.value;
            this.setState(newState);
        }

        this.view = (orderby = 'modificationDate', sort = 'asc', filterBy = this.state.filterBy) => {
            let snapshot = [...this.state.store];
            if (filterBy !== '') {
                snapshot = snapshot.filter((el) => {
                    return (
                        (el.request ? el.request.includes(filterBy) : true) || 
                        (el.destination ? el.destination.includes(filterBy) : true)
                    );
                })
            }
            const result = snapshot.sort((a, b) => sortByMultipleProperties(a, b, [`-${orderby}`, 'order']));
            if(sort === 'desc') result.reverse();
            return result;
        }

        this.createRedirection = () => {
            let newState = this.state;
            newState.store.push({id: v4()});
            this.setState(newState);
        }

        this.toggleWildcard = (e) => {
            let newState = this.state;
            newState.wildcard = !this.state.wildcard;
            this.setState(newState);
        }

        this.saveStore = async () => {
            this.setState({saving: true});
            const payload = {wildcard: this.state.wildcard, store: this.state.store}
            const init = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
            let result: Response;
            try {
                result = await fetch(ajaxUrl+'?action=saveRedirects', init);
            } catch (e) {
                this.showNotification('error', 'An Error ocurred! Changes not saved');
                return e;
            }
            if (result.ok) {
                let json: {data : {redirects_added: number, redirects_modified: number, redirects_deleted: number, store: Array<WerRedirectionData>}};
                try {
                    json = await result.json();
                } catch (e) {
                    this.showNotification('error', 'An Error ocurred! Changes not saved');
                    return e;
                }
                if (json.data.redirects_added === 0 && json.data.redirects_modified === 0 && json.data.redirects_deleted === 0)
                {
                    this.showNotification('warning', 'No changes were made!');
                } else {
                    this.showNotification('success', ({msg}) => { 
                        return (
                        <div>Redirects Succesfully saved!<br/>
                        Added: {json.data.redirects_added}<br/>
                        Modified: {json.data.redirects_modified}<br/>
                        Deleted: {json.data.redirects_deleted}</div>
                        )
                    });
                }
                let newState = this.state;
                newState.store = this.validateStore(json.data.store);
                newState.saving = false;
                newState.lastSave = result.ok;
                this.setState(newState);
            } else {
                this.showNotification('error', 'An Error ocurred! Changes not saved');
            }
            return;
        }

        this.state = {
            store: this.validateLoad(this.props.initialState.store),
            view: this.view,
            setStore: this.setStore,
            getRedirection: this.getRedirection,
            deleteRedirection: this.deleteRedirection,
            saving: false,
            filterBy: '',
            setFilter: this.setFilter,
            lastSave: null,
            wildcard: this.props.initialState.wildcard,
            createRedirection: this.createRedirection,
            toggleWildcard: this.toggleWildcard,
            saveStore: this.saveStore
        }
    }

    public static defaultProps = {
        initialState: []
    };
    
    public render(): JSX.Element {
        return (
            <StoreContextProvider value={this.state}>
                <table className='widefat'>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                <WerToolbar />
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={2} >Request</th>
                            <th>Destination</th>
                            <th>Last Modification</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                            <WerListRedirections />
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={5}>
                                <WerToolbar />
                            </th>
                        </tr>
                    </tfoot>
                </table>
                <ToastContainer position='bottom-right'/>
            </StoreContextProvider>
        )
    }
}

mountComponent('#redirects_manager', WerTable);
