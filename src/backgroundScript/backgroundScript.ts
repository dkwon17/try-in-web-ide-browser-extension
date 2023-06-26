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

function injectedFunction(value) {
    return () => {
        alert(value)
    }
}

function injectedAlert() {
        alert('HI')
}

// chrome.tabs.onCreated.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: injectedFunction,
//     });
// });

// tab id to status
const map = {}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("update")
    console.log(JSON.stringify(changeInfo))
    console.log(JSON.stringify(tab))

    // if (tab.url?.startsWith("https://github."))
    if (!tab.url) {
        return;
    }

    if (tab.url.startsWith("https://www.cp24.com/") && tab.status === 'complete') {
        console.log("execute!")
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectedAlert,
        });
    }
});
