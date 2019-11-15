import * as React from "react";
import * as ReactDOM from "react-dom";
import { v4 } from "uuid"
import { mountComponent } from 'mount-component';

import { StoreContextProvider, WerRedirectionsArray, WerRedirectionData, WerContextInterface } from "./lib/store-context";

import { WerListRedirections } from "./components/wer-list-redirections"
import { WerTextfieldProps } from "./components/wer-textfield";
import { WerButton } from './components/wer-button';

export interface WerTableProps {
    initialState: Array<WerRedirectionData>;
}

const ajaxUrl : string = (window as any).ajaxurl;

export class WerTable extends React.Component<WerTableProps> {

    private setStore : (args: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => void;
    private getRedirection: (id: string) => WerRedirectionData;
    private createRedirection: () => void;
    private deleteRedirection: (id: string) => void;
    private validateStore: (store : Array<WerRedirectionData>) => Array<WerRedirectionData>;
    private validateLoad: (store : Array<WerRedirectionData>) => Array<WerRedirectionData>;
    private saveStore: CallableFunction;
    public state: WerContextInterface;

    constructor(props) {
        super(props);

        this.setStore = (args: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => {
            var newStore = this.state.store;
            const redirection = newStore.filter((el) => {
                return el.id === args.id;
            })[0];
            if (redirection) {
                redirection[args.name] = e.target.value;
            }
            var newState = this.state;
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
            var newState = this.state;
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

        this.validateLoad= (store) => {
            const validatedLoad: Array<WerRedirectionData> = store.map((redirection) => {
                if (!redirection.id || redirection.id === '') redirection.id = v4();
                return redirection
            })
            return this.validateStore(validatedLoad);
        }

        this.state = {
            store: this.validateLoad(this.props.initialState),
            setStore: this.setStore,
            getRedirection: this.getRedirection,
            deleteRedirection: this.deleteRedirection,
            saving: false,
            lastSave: null,
        }

        this.createRedirection = () => {
            var newState = this.state;
            newState.store.push({id: v4()})
            this.setState(newState);
        }

        this.saveStore = async () => {
            this.setState({saving: true});
            const init = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.store)
            }
            let result: Response;
            try {
                result = await fetch(ajaxUrl+'?action=saveRedirects', init);
            } catch (e) {
                throw e;
            }
            this.setState({saving: false})
            if (result.ok) {
                const data = await result.json();
                this.setState({lastSave: data});
            }
        }
    }

    public static defaultProps = {
        initialState: []
    };
    
    public render(): JSX.Element {
        return (
            <StoreContextProvider value={this.state}>
                <table className="widefat">
                    <thead>
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
                                <WerButton caption="Add new Redirection" callback={this.createRedirection} />
                                <WerButton caption="Save Redirections" callback={this.saveStore} />
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </StoreContextProvider>
        )
    }
}

mountComponent('#redirects_manager', WerTable);
