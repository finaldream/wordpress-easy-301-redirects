import * as React from 'react';

interface SaveNotificationProps { added: number; modified: number; deleted: number; }

export const SaveNotification = ({added, modified, deleted}: SaveNotificationProps) => {
    return (
        <div>
            Redirects Succesfully saved!<br/>
            Added: {added}<br/>
            Modified: {modified}<br/>
            Deleted: {deleted}
        </div>
    );
};
