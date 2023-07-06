/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { OPEN_OPTIONS } from '../messageActions';

chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case OPEN_OPTIONS:
            chrome.runtime.openOptionsPage();
            break;
        default:
            break;
    }
});

let prev: Promise<any> = Promise.resolve();

const shouldInjectScript = (changeInfo, tab) => {
    if (!tab.url) {
        return false;
    }

    if (Object.keys(changeInfo).length === 0) {
        return tab.status === 'complete';
    }
    return changeInfo.status === 'complete';
}

/**
 * sometimes changeInfo details are not provided in safari
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('onUpdated')
    console.log(`changeInfo: ${JSON.stringify(changeInfo)}`)
    console.log(`tab: ${JSON.stringify(tab)}`)
    console.log(`tabId: ${JSON.stringify(tabId)}`)

    if (changeInfo.status === 'complete' && tab.status !== 'complete') {
        console.log('SOMETHING IS NOT RIGHT!')
    }

    if (shouldInjectScript(changeInfo, tab)) {
        console.log('TRY TO EXECUTE SCRIPT!')
        prev = prev.then(() => {
            console.log('Start execute!')
            return chrome.scripting.executeScript({
                target: { tabId },
                files: ["contentScript.bundle.js"]
            })
        })
        .then((result) => {
            // The delay time is needed in the case where
            // executeContentScript is executed multiple times in a short
            // period of time.
            
            // Delay time ensures executions of contentScript.bundle.js
            // stay separate.
            
            // The contentScript.bundle.js script runs an async function,
            // and chrome.scripting.executeScript can resolve before the async
            // function resolves.
            return delay(500)
        });
    }
});

const delay = (ms) => {
    return new Promise<void>((res) => {
        setTimeout(() => {
            console.log('Delay done!')
            res()
        }, ms);
    })
}
