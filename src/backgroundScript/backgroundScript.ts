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

const delayFunc = (delay, count) => {
    return new Promise(res => setTimeout(() => {
        console.log('Timeout done!! ' + count)
        res(true)
    }, delay))
}

let promiseChain: Promise<any> = Promise.resolve();

let count = 0

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (!tab.url) {
        return;
    }

    if (changeInfo.status === 'complete') {
        console.log('Execute order 66.')
        count += 1
        // const delay = delayFunc(5000, count)

        promiseChain = promiseChain.then(() => {
            // return delayFunc(3000, count)
            console.log('try!')
            return chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["contentScript.bundle.js"]
            });
        })
    }
});
