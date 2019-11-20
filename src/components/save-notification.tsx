import * as React from 'react';

interface SaveNotificationProps { added: number; modified: number; deleted: number; wildcard: boolean; }

export const SaveNotification = ({added, modified, deleted, wildcard}: SaveNotificationProps) => {
    return (
        <div>
            Redirects Succesfully saved!<br/>
            Added: {added}<br/>
            Modified: {modified}<br/>
            Deleted: {deleted}<br/>
            Wildcard is {wildcard ? 'active' : 'inactive'}
        </div>
    );
};
