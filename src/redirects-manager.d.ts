import * as React from "react";
import { WerRedirectionData, WerContextInterface } from "./lib/store-context";
export interface WerTableProps {
    initialState: Array<WerRedirectionData>;
}
export declare class WerTable extends React.Component<WerTableProps> {
    private setStore;
    private getRedirection;
    private createRedirection;
    private deleteRedirection;
    private validateStore;
    state: WerContextInterface;
    constructor(props: any);
    static defaultProps: {
        initialState: any[];
    };
    render(): JSX.Element;
}
