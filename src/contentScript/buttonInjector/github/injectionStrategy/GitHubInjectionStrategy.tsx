/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";

import { Endpoint } from "../../../../preferences/preferences";
import { FileNavigationStrategy } from './FileNavigationStrategy';
import { ButtonStrategy } from './ButtonStrategy';

// The 'Dev Spaces' button is injected into the GitHub UI in one of two ways.
// This is because GitHub updated it's front-end UI, rendering the old method of injecting the button obsolete.
// The old method still needs to be supported however, to support for older GitHub Enterprise instances.
//
// FileNavigationStrategy: Injects the 'Dev Spaces' button into the '.file-navigation' div. This is the old method of injecting the button.
// ButtonStrategy: Injects the 'Dev Spaces' button by finding the 'Code' button and injecting the button into it's parent div.
export interface GitHubInjectionStrategy {
    inject(endpoints: Endpoint[]): Promise<void>;
}

export function getInjectionStrategy(): GitHubInjectionStrategy | undefined {
    if (FileNavigationStrategy.matches()) {
        return new FileNavigationStrategy();
    }

    if (ButtonStrategy.matches()) {
        return new ButtonStrategy();
    }
    return undefined;
}
