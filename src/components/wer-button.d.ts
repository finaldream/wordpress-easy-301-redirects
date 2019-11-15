import * as React from "react";
export interface WerButtondProps {
    caption: string;
    callback?: CallableFunction;
    disabled: boolean;
}
interface WerButtonState {
    caption: string;
    disabled: boolean;
}
export declare class WerButton extends React.Component<WerButtondProps, {}> {
    state: WerButtonState;
    private _isMounted;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onClick: () => Promise<any>;
    static defaultProps: {
        caption: string;
        callback: () => void;
        disabled: boolean;
    };
    render(): JSX.Element;
}
export {};
