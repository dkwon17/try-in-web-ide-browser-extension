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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log('onUpdated')
    if (!tab.url) {
        return;
    }
    if (changeInfo.status === 'complete') {
        console.log('update prev')
        prev = prev.then(() => {
            return chrome.scripting.executeScript({
                target: { tabId },
                files: ["contentScript.bundle.js"]
            })
        })
        // .then((result) => {
        //     // The delay time is needed in the case where
        //     // executeContentScript is executed multiple times in a short
        //     // period of time.
            
        //     // Delay time ensures executions of contentScript.bundle.js
        //     // stay separate.
            
        //     // The contentScript.bundle.js script runs an async function,
        //     // and chrome.scripting.executeScript can resolve before the async
        //     // function resolves.
        //     return delay(5000)
        // });
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
