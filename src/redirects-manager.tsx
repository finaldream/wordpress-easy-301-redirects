import * as React from "react";
import * as ReactDOM from "react-dom";

import { StoreContextProvider, WerRedirectionsArray, WerRedirectionData, WerContextInterface } from "./lib/store-context";

import { WerListRedirections } from "./components/wer-list-redirections"
import { WerRedirection } from "./components/wer-redirection"
import { WerTextfieldProps } from "./components/wer-textfield";

const initialState = [
    {
        id: 1,
        request: "http://www.google.com",
        destination: "http://test.org"
    },    
    {
        id: 2,
        request: "http://www.another.com",
        destination: "http://justme.org"
    }
];

export class WerTable extends React.Component {

    private setStore : CallableFunction;
    private getRedirection: CallableFunction;
    public state: WerContextInterface;

    constructor(props) {
        super(props);

        this.setStore = (props: WerTextfieldProps, e: React.ChangeEvent<HTMLInputElement>) => {
            console.log('on context setStore');
            var newStore = this.state.store;
            const redirection = newStore.filter((el) => {
                return el.id == props.id;
            })[0];
            if (redirection) {
                redirection[props.name] = e.target.value;
            } else {
                const newRedirection : WerRedirectionData = { id: 0, [props.name] : e.target.value }
                newStore.push(newRedirection)
            }
            var newState = this.state;
            newState.store = newStore;
            this.setState(newState)
        };

        this.getRedirection = (id: string | number) => {
            const redirectionState = this.state.store.find((el) => {
                return el.id === id;
            }, this)
            return redirectionState ? redirectionState : {id: 0, request: null, destination: null, modificationDate: null };
        }

        this.state = {
            store: initialState,
            setStore: this.setStore,
            getRedirection: this.getRedirection
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
                    <WerRedirection id="0" />
                </StoreContextProvider>
            </tbody>
        </table>
        )
    }
}

ReactDOM.render(
    <WerTable />,
    document.getElementById("redirects_manager")
);