import * as React from "react";
export interface WerTextfieldProps {
    name: string;
    id: string;
    content?: string;
    placeholder?: string;
    warning?: boolean;
}
export declare class WerTextfield extends React.Component<WerTextfieldProps, {}> {
    render(): JSX.Element;
}
