
import * as React from "react";
import { toast, ToastContent, ToastOptions, TypeOptions } from 'react-toastify';
import { v4 } from 'uuid'

import { RedirectionsStore, RedirectsManagerContextInterface } from './redirects-manager-context';

const ajaxUrl : string = (window as any).ajaxurl;

export const showNotification = (type: TypeOptions, content: ToastContent, options: ToastOptions = {}) => {
    options.type = type;
    return toast(content, options);
}

export const validateLoad = (store: RedirectionsStore) => {
    let valid = true;
    const validatedLoad: RedirectionsStore = store.map((redirection) => {
        if (!redirection.id || redirection.id === '') {
            redirection.id = v4();
            valid = false;
        } 
        return redirection
    })
    if (!valid) showNotification('info', 'Data imported from old Simple301 plugin. Please review and save your changes to commit. After saving please deactivate the old plugin.');
    return validatedLoad;
}

export const saveState = async (state : RedirectsManagerContextInterface) => {
    const payload = {wildcard: state.wildcard, store: state.store}
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    let result: Response;
    try {
        result = await fetch(ajaxUrl+'?action=saveRedirects', init);
    } catch (e) {
        this.showNotification('error', 'An Error ocurred! Changes not saved');
        throw e;
    }
    if (result.ok) {
        let json: {data : {redirects_added: number, redirects_modified: number, redirects_deleted: number, store: RedirectionsStore}};
        try {
            json = await result.json();
        } catch (e) {
            showNotification('error', 'An Error ocurred! Changes not saved');
            throw e;
        }
        if (json.data.redirects_added === 0 && json.data.redirects_modified === 0 && json.data.redirects_deleted === 0)
        {
            showNotification('warning', 'No changes were made!');
        } else {
            showNotification('success', `
            Redirects Succesfully saved!\n
            Added: ${json.data.redirects_added}\n
            Modified: ${json.data.redirects_modified}\n
            Deleted: ${json.data.redirects_deleted}\n
            `);
        }
        const final : RedirectsManagerContextInterface = {...state, store: json.data.store};
        return final;
    } else {
        showNotification('error', 'An Error ocurred! Changes not saved');
        throw new Error(result.statusText);
    }
}