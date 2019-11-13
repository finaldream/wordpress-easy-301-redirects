import * as React from "react";
import * as ReactDOM from "react-dom";
import { v4 } from "uuid"

import { StoreContextProvider, WerRedirectionsArray, WerRedirectionData, WerContextInterface } from "./lib/store-context";

import { WerListRedirections } from "./components/wer-list-redirections"
import { WerRedirection } from "./components/wer-redirection"
import { WerTextfieldProps } from "./components/wer-textfield";
import { WerButton } from './components/wer-button';

const initialState : WerRedirectionsArray = [
    {
        id: v4(),
        request: "http://www.google.com",
        destination: "http://test.org"
    },    
    {
        id: v4(),
        request: "http://www.another.com",
        destination: "http://justme.org"
    },
];

export class WerTable extends React.Component {

    private setStore : (args: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => void;
    private getRedirection: (id: string) => WerRedirectionData;
    private createRedirection: () => void;
    private deleteRedirection: (id: string) => void;
    private validateStore: (store : Array<WerRedirectionData>) => Array<WerRedirectionData>;
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
            newState.store = newStore;
            this.setState(newState)
        }

        this.state = {
            store: initialState,
            setStore: this.setStore,
            getRedirection: this.getRedirection,
            deleteRedirection: this.deleteRedirection
        }

        this.createRedirection = () => {
            var newState = this.state;
            newState.store.push({id: v4()})
            this.setState(newState);
        }

        this.validateStore = (store) => {
            const validatedStore: Array<WerRedirectionData> = store.map((redirection) => {
                if(redirection.request && redirection.request !== '') {
                    const colliders = this.state.store.filter(el => {
                        return el.request === redirection.request;
                    })
                    redirection.warningRequestDuplication = colliders.length > 1;
                } else {
                    redirection.warningRequestDuplication = false;
                }
                return redirection
            }, this)
            return validatedStore;
        }
    }
    
    public render(): JSX.Element {
        return (
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
                <StoreContextProvider value={this.state}>
                    <WerListRedirections />
                </StoreContextProvider>
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={5}><WerButton caption="Add new Redirection" callback={this.createRedirection} /></th>
                </tr>
            </tfoot>
        </table>
        )
    }
}

ReactDOM.render(
    <WerTable />,
    document.getElementById("redirects_manager")
);