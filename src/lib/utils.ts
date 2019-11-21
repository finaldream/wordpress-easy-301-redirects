
import * as React from 'react';
import { toast, ToastContent, ToastOptions, TypeOptions, Toast } from 'react-toastify';
import { v4 } from 'uuid';
import { countBy, transform } from 'lodash';

import { RedirectsManagerStateInterface, RedirectionProps } from './redirects-manager-state';
import { SaveNotification } from '../components/save-notification';

const ajaxUrl: string = (window as any).ajaxurl;

type showNotificationType = (type: TypeOptions, content: ToastContent, options?: ToastOptions ) => React.ReactText;

type saveStateType = (state: RedirectsManagerStateInterface) => Promise<RedirectsManagerStateInterface>;

type validatedLoadType = (state: RedirectsManagerStateInterface) => RedirectsManagerStateInterface;

type sortByPropertyType = ({}, {}, property: string ) => number;

type sortByMultiplePropertiesType = ({}, {}, properties: string[] ) => number;

type checkRepeatedRequestsType = ( state: RedirectsManagerStateInterface) => RedirectsManagerStateInterface;

export const showNotification: showNotificationType = (type, content, options = {}) => {
    options.type = type;
    return toast(content, options);
};

export const validateLoad: validatedLoadType = (state) => {
    let valid = true;
    state.store = state.store.map((redirection) => {
        if (!redirection.id || redirection.id === '') {
            redirection.id = v4();
            redirection.modificationDate = 'not saved';
            valid = false;
        }
        return redirection;
    });
    state.imported = false;
    if (!valid) {
        state.imported = true;
        showNotification('info', 'Data imported from old Simple301 plugin. Please review and save your changes to commit. After saving please deactivate the old plugin.');
    }
    state.perPage = 10;
    return checkRepeatedRequests(state);
};

export const saveState: saveStateType = async (state) => {
    const payload = {wildcard: state.wildcard, store: state.store};
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    let result: Response;
    try {
        result = await fetch(ajaxUrl + '?action=saveRedirects', init);
    } catch (e) {
        this.showNotification('error', 'An Error ocurred! Changes not saved');
        throw e;
    }
    if (result.ok) {
        let json: {data: {
            redirects_added: number,
            redirects_modified: number,
            redirects_deleted: number,
            store: RedirectionProps[],
            wildcard: boolean
        }};
        try {
            json = await result.json();
        } catch (e) {
            showNotification('error', 'An Error ocurred! Changes not saved');
            throw e;
        }
        if (json.data.redirects_added === 0 &&
            json.data.redirects_modified === 0 &&
            json.data.redirects_deleted === 0) {
            showNotification('success', `No changes to redirections. Wildcars is ${json.data.wildcard ? 'active' :  'inactive'}` );
        } else {
            const notificationMsg = !state.imported ? SaveNotification({
                added: json.data.redirects_added,
                modified: json.data.redirects_modified,
                deleted: json.data.redirects_deleted,
                wildcard: json.data.wildcard
            }) : 'Success! Your first save is done! Please deactivate Simple 301 Redirects plugin to avoid conflicts';
            showNotification('success', notificationMsg);
        }
        const final: RedirectsManagerStateInterface = {...state, store: json.data.store};
        return validateLoad(final);
    } else {
        showNotification('error', 'An Error ocurred! Changes not saved');
        throw new Error(result.statusText);
    }
};

export const sortByProperty: sortByPropertyType = (a, b, property) => {
    let sortOrder: -1|1 = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    if (!a[property] || !b[property] ) { return 0; }
    return ( (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0 ) * sortOrder;
};

export const sortByMultipleProperties: sortByMultiplePropertiesType = (a, b, properties) => {
    let i = 0;
    let result = 0;
    const numberOfProperties = properties.length;
    while (result === 0 && i < numberOfProperties) {
        result = sortByProperty(a, b, properties[i]);
        i++;
    }
    return result;
};

export const checkRepeatedRequests: checkRepeatedRequestsType = (state) => {
    const repeatedRequest: string[] = transform( countBy(state.store, (el) => el.request), (result, count, value) => {
        if (count > 1) { result.push(value); }
    }, [] );
    state.store.map( (el) => el.warningRequestDuplication = repeatedRequest.includes(el.request));
    return state;
};
