import * as React from "react";
export interface WerButtondProps {
    caption: string;
    callback?: CallableFunction;
}
export declare class WerButton extends React.Component<WerButtondProps, {}> {
    static defaultProps: {
        caption: string;
        callback: () => void;
    };
    render(): JSX.Element;
}
