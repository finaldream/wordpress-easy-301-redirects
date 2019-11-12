import * as React from "react";
export interface WerTextfieldProps {
    name: string;
    id: React.ReactText;
    content?: string;
    placeholder?: string;
}
export declare class WerTextfield extends React.Component<WerTextfieldProps, {}> {
    render(): JSX.Element;
}
