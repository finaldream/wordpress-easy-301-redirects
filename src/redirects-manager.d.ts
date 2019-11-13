import * as React from "react";
import { WerContextInterface } from "./lib/store-context";
export declare class WerTable extends React.Component {
    private setStore;
    private getRedirection;
    private createRedirection;
    private deleteRedirection;
    private validateStore;
    state: WerContextInterface;
    constructor(props: any);
    render(): JSX.Element;
}
