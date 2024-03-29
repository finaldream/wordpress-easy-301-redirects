
import { toast, ToastContent, ToastOptions, TypeOptions, Toast } from 'react-toastify';
import { v4 } from 'uuid';
import { countBy, transform } from 'lodash';

import { RedirectsManagerStateInterface, RedirectionProps } from './redirects-manager-state';
import { SaveNotification } from '../components/save-notification';

const ajaxUrl: string = (window as any).ajaxurl;

export const showNotification = (type: TypeOptions, content: ToastContent, options: ToastOptions = {}) => {
    options.type = type;
    return toast(content, options);
};

export const validateLoad = (state: RedirectsManagerStateInterface) => {
    let valid = true;
    state.redirects = state.redirects.map((redirection) => {
        if (!redirection.id || redirection.id === '') {
            redirection.id = v4();
            redirection.modificationDate = null;
            valid = false;
        }
        return redirection;
    });
    state.imported = false;
    if (!valid) {
        state.imported = true;
        showNotification('info', 'Data imported from old Simple301 plugin. Please review and save your changes to commit. After saving please deactivate the old plugin.');
    }
    return checkRepeatedRequests(state);
};

export const saveState = async (state: RedirectsManagerStateInterface) => {
    const payload = {redirects: state.redirects};
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
        showNotification('error', 'An Error ocurred! Changes not saved');
        throw e;
    }
    if (result.ok) {
        let json: {data: {
            redirects_added: number,
            redirects_modified: number,
            redirects_deleted: number,
            redirects: RedirectionProps[]
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
            showNotification('warning', 'No changes to redirections.' );
        } else {
            const notificationMsg = !state.imported ? SaveNotification({
                added: json.data.redirects_added,
                modified: json.data.redirects_modified,
                deleted: json.data.redirects_deleted,
            }) : 'Success! Your first save is done! Please deactivate Simple 301 Redirects plugin to avoid conflicts';
            showNotification('success', notificationMsg);
        }
        const final: RedirectsManagerStateInterface = {...state, redirects: json.data.redirects};
        return parseLoad(validateLoad(final));
    } else {
        showNotification('error', 'An Error ocurred! Changes not saved');
        throw new Error(result.statusText);
    }
};

export const sortByProperty = (a: {}, b: {}, property: string) => {
    let sortOrder: -1|1 = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.slice(1);
    }
    if (!a[property] || !b[property] ) { return 0; }
    return ( (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0 ) * sortOrder;
};

export const sortByMultipleProperties = (a: {}, b: {}, properties: string[]) => {
    let i = 0;
    let result = 0;
    const numberOfProperties = properties.length;
    while (result === 0 && i < numberOfProperties) {
        result = sortByProperty(a, b, properties[i]);
        i++;
    }
    return result;
};

export const checkRepeatedRequests = (state: RedirectsManagerStateInterface) => {
    const repeatedRequest: string[] = transform(
        countBy(state.redirects, (el) => el.request), (result, count, value) => {
        if (count > 1) { result.push(value); }
    }, [] );
    state.redirects.map( (el) => el.warningRequestDuplication = repeatedRequest.includes(el.request));
    return state;
};

export const parseLoad = (state: RedirectsManagerStateInterface) => {
    const parsedRedirects =  state.redirects.map((r) => {
        const modificationDate = typeof r.modificationDate === 'string' ? new Date(r.modificationDate) : r.modificationDate;
        return { ...r, modificationDate };
    });
    return {...state, redirects: parsedRedirects}
};
