import * as React from 'react';
export interface RedirectionProps {
    id: string;
    request?: string;
    destination?: string;
    modificationDate?: string;
}
export declare class WerRedirection extends React.Component<RedirectionProps, {}> {
    render(): JSX.Element;
}
